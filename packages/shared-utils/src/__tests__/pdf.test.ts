import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mock pdfjs-dist
// ---------------------------------------------------------------------------

const mockRenderPromise = { promise: Promise.resolve() };
const mockContext = {
  drawImage: vi.fn(),
  fillRect: vi.fn(),
};
const mockCanvas = {
  getContext: vi.fn(() => mockContext),
  toDataURL: vi.fn(() => 'data:image/jpeg;base64,mockBase64Data'),
  height: 0,
  width: 0,
};

const mockPage = {
  getViewport: vi.fn(() => ({ width: 612, height: 792 })),
  render: vi.fn(() => mockRenderPromise),
};

const mockPdf = {
  numPages: 2,
  getPage: vi.fn(() => Promise.resolve(mockPage)),
};

vi.mock('pdfjs-dist/legacy/build/pdf.mjs', () => ({
  default: {
    GlobalWorkerOptions: { workerSrc: '' },
    version: '3.0.0',
    getDocument: vi.fn(() => ({
      promise: Promise.resolve(mockPdf),
    })),
  },
  GlobalWorkerOptions: { workerSrc: '' },
  version: '3.0.0',
  getDocument: vi.fn(() => ({
    promise: Promise.resolve(mockPdf),
  })),
}));

// ---------------------------------------------------------------------------
// Mock browser APIs
// ---------------------------------------------------------------------------

// Use a class so `new FileReader()` works correctly with vitest
class MockFileReader {
  result: string = 'data:application/pdf;base64,mockData';
  onload: (() => void) | null = null;
  onerror: ((error: any) => void) | null = null;
  readAsDataURL = vi.fn();
}

vi.stubGlobal('FileReader', MockFileReader);
vi.stubGlobal('document', {
  createElement: vi.fn(() => mockCanvas),
});

// Import after mocks
import { convertPdfToImages, fileToBase64 } from '../pdf';

describe('pdf utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCanvas.getContext.mockReturnValue(mockContext);
    mockPdf.numPages = 2;
    mockPdf.getPage.mockResolvedValue(mockPage);
  });

  // ── convertPdfToImages ────────────────────────────────────────────

  describe('convertPdfToImages', () => {
    it('converts PDF pages to base64 images', async () => {
      const file = new File(['pdf-content'], 'test.pdf', { type: 'application/pdf' });

      const images = await convertPdfToImages(file);

      expect(images).toHaveLength(2);
      expect(images[0]).toBe('data:image/jpeg;base64,mockBase64Data');
      expect(images[1]).toBe('data:image/jpeg;base64,mockBase64Data');
    });

    it('uses 2x scale for viewport', async () => {
      const file = new File(['pdf-content'], 'test.pdf', { type: 'application/pdf' });

      await convertPdfToImages(file);

      expect(mockPage.getViewport).toHaveBeenCalledWith({ scale: 2.0 });
    });

    it('handles multiple pages', async () => {
      mockPdf.numPages = 3;
      const file = new File(['pdf-content'], 'test.pdf', { type: 'application/pdf' });

      const images = await convertPdfToImages(file);

      expect(images).toHaveLength(3);
      expect(mockPdf.getPage).toHaveBeenCalledTimes(3);
      expect(mockPdf.getPage).toHaveBeenCalledWith(1);
      expect(mockPdf.getPage).toHaveBeenCalledWith(2);
      expect(mockPdf.getPage).toHaveBeenCalledWith(3);
    });

    it('skips pages without canvas context', async () => {
      mockPdf.numPages = 2;
      // First page returns null context, second page works fine
      mockCanvas.getContext
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(mockContext);

      const file = new File(['pdf-content'], 'test.pdf', { type: 'application/pdf' });

      const images = await convertPdfToImages(file);

      // Only the second page should produce an image
      expect(images).toHaveLength(1);
    });
  });

  // ── fileToBase64 ──────────────────────────────────────────────────

  describe('fileToBase64', () => {
    it('converts file to data URL string', async () => {
      const file = new File(['hello'], 'test.txt', { type: 'text/plain' });

      const promise = fileToBase64(file);

      // Get the FileReader instance that was created
      // The source code does `new FileReader()` then sets `reader.onload`
      // We need to trigger it after the promise is created
      // Since MockFileReader is instantiated inside fileToBase64, we need
      // to capture the instance. We can do this by spying on the constructor.
      // Instead, let's use a microtask to let the promise set up, then trigger.
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Find the most recently created FileReader instance
      // We can access it through the readAsDataURL mock
      const readerInstances = MockFileReader.prototype;
      // Actually, we need to get the specific instance. Let's restructure:
      // The readAsDataURL was called on the instance, so we can check:
      const lastInstance = vi.mocked(MockFileReader).mock.instances[0] as any;
      if (lastInstance?.onload) {
        lastInstance.onload();
      }

      const result = await promise;
      expect(result).toBe('data:application/pdf;base64,mockData');
    });

    it('rejects on reader error', async () => {
      const file = new File(['hello'], 'test.txt', { type: 'text/plain' });

      const promise = fileToBase64(file);

      await new Promise((resolve) => setTimeout(resolve, 0));

      const lastInstance = vi.mocked(MockFileReader).mock.instances[0] as any;
      const readError = new Error('Read failed');
      if (lastInstance?.onerror) {
        lastInstance.onerror(readError);
      }

      await expect(promise).rejects.toEqual(readError);
    });
  });
});
