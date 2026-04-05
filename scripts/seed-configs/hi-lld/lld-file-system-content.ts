/**
 * File System — LLD Interview Prep Content
 * Based on HelloInterview extract
 * Covers: requirements gathering, entity identification, Composite pattern,
 * abstract base class design, path resolution, parent pointers, thread safety
 */

import { StoryPointSeed, ItemSeed } from "../subhang-content";

export const lldFileSystemContent: StoryPointSeed = {
  title: "Design an In-Memory File System (LLD)",
  description:
    "Master the low-level design of an in-memory file system — covering the Composite pattern, abstract base classes, parent pointer vs stored path tradeoffs, path resolution helpers, tree manipulation (create, delete, move, rename), cycle detection, and thread safety with lock ordering.",
  type: "standard",
  sections: [
    { id: "sec_materials", title: "Study Materials", orderIndex: 0 },
    { id: "sec_questions", title: "Practice Questions", orderIndex: 1 },
  ],
  items: [
    // ═══════════════════════════════════════════════════════
    // MATERIALS
    // ═══════════════════════════════════════════════════════

    // Material 1: Requirements & Entity Design
    {
      title: "File System — Requirements & Entity Design",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "File System — Requirements & Entity Design",
          blocks: [
            {
              id: "b1",
              type: "heading",
              content: "What is an In-Memory File System?",
              metadata: { level: 2 },
            },
            {
              id: "b2",
              type: "paragraph",
              content:
                "An in-memory file system is a hierarchical data structure that models the familiar folder/file tree you use every day — but entirely in RAM. Without persistence, caching, or I/O concerns, the problem becomes a pure data-structure and OOP design exercise. The deceptive familiarity is a trap: everyone knows how file systems work, so candidates often skip clarification and jump into code. The interviewer has specific scope expectations.",
            },
            {
              id: "b3",
              type: "heading",
              content: "Clarifying Questions & Requirements",
              metadata: { level: 2 },
            },
            {
              id: "b4",
              type: "paragraph",
              content:
                "Structure your questions around hierarchy shape, supported operations, file content, error handling, and scale. This conversation should take 3-5 minutes and dramatically narrow the design space.",
            },
            {
              id: "b5",
              type: "list",
              content: "",
              metadata: {
                listType: "ordered",
                items: [
                  "Hierarchy: Single root directory (Unix-style /home/user/file.txt), not Windows drive letters.",
                  "Operations: Create, delete, list contents, navigate/resolve absolute paths, rename, and move files and folders.",
                  "File content: Files store simple string content. Folders do not store content.",
                  "Error handling: Invalid operations (creating where parent doesn't exist, deleting root, name collisions) throw specific exception types.",
                  "Scale: Tens of thousands of entries. Must stay responsive with deep hierarchies.",
                  "Out of scope: Search, relative paths (../), permissions, timestamps, symbolic links, persistence, UI.",
                ],
              },
            },
            {
              id: "b6",
              type: "heading",
              content: "Entity Identification",
              metadata: { level: 2 },
            },
            {
              id: "b7",
              type: "paragraph",
              content:
                "Scan requirements for nouns that represent things with state or behavior. Not every noun deserves a class — paths are input strings, not entities.",
            },
            {
              id: "b8",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "File — YES. A leaf node with a name and string content. Cannot contain children.",
                  "Folder (Directory) — YES. A container node with a name and a collection of child entries (files or folders). Does not store content.",
                  "FileSystem — YES. The orchestrator. Owns the root folder, parses paths, provides the public API. External code interacts with this class, never directly with Folder or File.",
                  "Path — NOT an entity. A path is a string input to operations, not something with its own state or behavior. We parse paths but don't model them as a class.",
                ],
              },
            },
            {
              id: "b9",
              type: "quote",
              content:
                "A common mistake is exposing the root Folder directly and letting callers navigate manually. This pushes path parsing onto every caller, duplicating resolution logic everywhere. The FileSystem class encapsulates this complexity — it is the Facade pattern.",
            },
            {
              id: "b10",
              type: "heading",
              content: "The Composite Pattern",
              metadata: { level: 2 },
            },
            {
              id: "b11",
              type: "paragraph",
              content:
                "File and Folder share identity: both have names, parents, and paths. But they differ in containment — folders have children, files don't. This is the Composite pattern: a tree where leaves (File) and composites (Folder) share a common interface (FileSystemEntry). The pattern emerges naturally once you recognize the shared name/parent/getPath behavior and the need for a uniform children collection type.",
            },
            {
              id: "b12",
              type: "heading",
              content: "Parent Pointer vs Stored Path",
              metadata: { level: 2 },
            },
            {
              id: "b13",
              type: "paragraph",
              content:
                "Entries need to know their location in the tree for getPath(). Storing the full path as a string gives O(1) lookup but makes rename/move O(n) — renaming /home requires updating every descendant's path string. Parent pointers make getPath() O(depth) by walking up to root, but rename/move only update the entry itself. Since file system depths are typically 10-20 levels, the O(depth) tradeoff is negligible, while cascading path updates on rename are expensive. Parent pointers win.",
            },
          ],
          readingTime: 8,
        },
      },
    },

    // Material 2: Class Design & Implementation
    {
      title: "Class Design & Implementation",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Class Design & Implementation",
          blocks: [
            {
              id: "c1",
              type: "heading",
              content: "Final Class Design",
              metadata: { level: 2 },
            },
            {
              id: "c2",
              type: "code",
              content:
                "abstract class FileSystemEntry:\n    - name: string\n    - parent: Folder?\n\n    + FileSystemEntry(name)\n    + getName() -> string\n    + setName(name)\n    + getParent() -> Folder?\n    + setParent(Folder?)\n    + getPath() -> string\n    + isDirectory() -> boolean  // abstract\n\nclass File extends FileSystemEntry:\n    - content: string\n\n    + File(name, content)\n    + getContent() -> string\n    + setContent(content)\n    + isDirectory() -> false\n\nclass Folder extends FileSystemEntry:\n    - children: Map<string, FileSystemEntry>\n\n    + Folder(name)\n    + isDirectory() -> true\n    + addChild(entry) -> boolean\n    + removeChild(name) -> FileSystemEntry?\n    + getChild(name) -> FileSystemEntry?\n    + hasChild(name) -> boolean\n    + getChildren() -> List<FileSystemEntry>\n\nclass FileSystem:\n    - root: Folder\n\n    + FileSystem()\n    + createFile(path, content) -> File\n    + createFolder(path) -> Folder\n    + delete(path)\n    + list(path) -> List<FileSystemEntry>\n    + get(path) -> FileSystemEntry\n    + rename(path, newName)\n    + move(srcPath, destPath)",
              metadata: { language: "text" },
            },
            {
              id: "c3",
              type: "heading",
              content: "Why an Abstract Base Class Over an Interface",
              metadata: { level: 2 },
            },
            {
              id: "c4",
              type: "paragraph",
              content:
                'An interface solves the typing problem (Map<string, FileSystemEntry>) but doesn\'t eliminate duplication — both File and Folder would still implement their own name field and getName(). An abstract base class shares state (name, parent) and behavior (getName, getPath, setParent) while letting subclasses differ on isDirectory() and containment. Inheritance is appropriate here because subtypes genuinely share behavior (not just data), that behavior is stable, and both satisfy the "is-a" relationship.',
            },
            {
              id: "c5",
              type: "heading",
              content: "Key Implementation: Path Resolution",
              metadata: { level: 2 },
            },
            {
              id: "c6",
              type: "code",
              content:
                'resolvePath(path)\n    if path == "/" return root\n    parts = path.substring(1).split("/")\n    current = root\n    for part in parts\n        if !current.isDirectory()\n            throw NotADirectoryException\n        child = current.getChild(part)\n        if child == null\n            throw NotFoundException\n        current = child\n    return current\n\nresolveParent(path)\n    lastSlash = path.lastIndexOf("/")\n    parentPath = lastSlash == 0 ? "/" : path.substring(0, lastSlash)\n    parent = resolvePath(parentPath)\n    if !parent.isDirectory() throw NotADirectoryException\n    return parent\n\nextractName(path)\n    return path.substring(path.lastIndexOf("/") + 1)',
              metadata: { language: "text" },
            },
            {
              id: "c7",
              type: "heading",
              content: "Key Implementation: getPath() via Parent Pointers",
              metadata: { level: 2 },
            },
            {
              id: "c8",
              type: "code",
              content:
                'getPath()\n    if parent == null\n        return name  // Root returns "/"\n    parentPath = parent.getPath()\n    if parentPath == "/"\n        return "/" + name\n    else\n        return parentPath + "/" + name',
              metadata: { language: "text" },
            },
            {
              id: "c9",
              type: "heading",
              content: "Key Implementation: Bidirectional Consistency in Folder",
              metadata: { level: 2 },
            },
            {
              id: "c10",
              type: "code",
              content:
                "addChild(entry)\n    if children.containsKey(entry.getName())\n        return false  // Name collision\n    children.put(entry.getName(), entry)\n    entry.setParent(this)  // Maintain bidirectional link\n    return true\n\nremoveChild(name)\n    entry = children.remove(name)\n    if entry != null\n        entry.setParent(null)  // Clear back-reference\n    return entry",
              metadata: { language: "text" },
            },
            {
              id: "c11",
              type: "heading",
              content: "Key Implementation: Move with Cycle Detection",
              metadata: { level: 2 },
            },
            {
              id: "c12",
              type: "code",
              content:
                'move(srcPath, destPath)\n    srcParent = resolveParent(srcPath)\n    srcName = extractName(srcPath)\n    entry = srcParent.getChild(srcName)\n    if entry == null throw NotFoundException\n\n    destParent = resolveParent(destPath)\n    destName = extractName(destPath)\n\n    // Cycle detection: can\'t move folder into itself or descendant\n    if entry.isDirectory()\n        current = destParent\n        while current != null\n            if current == entry\n                throw InvalidPathException("Cannot move folder into itself")\n            current = current.getParent()\n\n    if destParent.hasChild(destName)\n        throw AlreadyExistsException\n\n    srcParent.removeChild(srcName)\n    entry.setName(destName)\n    destParent.addChild(entry)',
              metadata: { language: "text" },
            },
            {
              id: "c13",
              type: "heading",
              content: "Key Implementation: Rename",
              metadata: { level: 2 },
            },
            {
              id: "c14",
              type: "paragraph",
              content:
                "Rename cannot just call setName() — the parent folder stores children in a map keyed by name. Changing the name without updating the map leaves the entry orphaned under its old key. Instead: remove by old name, update name, re-add by new name.",
            },
          ],
          readingTime: 12,
        },
      },
    },

    // Material 3: Extensibility & Thread Safety
    {
      title: "Extensibility & Thread Safety",
      type: "material",
      sectionId: "sec_materials",
      payload: {
        materialType: "rich",
        richContent: {
          title: "Extensibility & Thread Safety",
          blocks: [
            {
              id: "d1",
              type: "heading",
              content: "Thread Safety: The Check-Then-Act Race",
              metadata: { level: 2 },
            },
            {
              id: "d2",
              type: "paragraph",
              content:
                'Two threads calling createFile("/home/notes.txt") simultaneously both check hasChild("notes.txt") → false, then both call addChild. This classic check-then-act race condition means the check and action aren\'t atomic — another thread slips in between.',
            },
            {
              id: "d3",
              type: "heading",
              content: "Coarse-Grained Locking",
              metadata: { level: 3 },
            },
            {
              id: "d4",
              type: "paragraph",
              content:
                "Wrap every public FileSystem method in a synchronized(this) block. Simple, correct, but limits concurrency — two threads creating files in completely different folders block each other.",
            },
            {
              id: "d5",
              type: "heading",
              content: "Fine-Grained Locking",
              metadata: { level: 3 },
            },
            {
              id: "d6",
              type: "paragraph",
              content:
                "One lock per folder. synchronized(parent) in createFile means two threads creating files in different folders proceed in parallel. But move() touches two folders — locking both risks deadlock if two threads move in opposite directions simultaneously.",
            },
            {
              id: "d7",
              type: "heading",
              content: "Lock Ordering to Prevent Deadlock",
              metadata: { level: 2 },
            },
            {
              id: "d8",
              type: "code",
              content:
                "move(srcPath, destPath)\n    srcParent = resolveParent(srcPath)\n    destParent = resolveParent(destPath)\n\n    // Always lock in alphabetical order by path\n    firstLock = srcParent.getPath() < destParent.getPath() ? srcParent : destParent\n    secondLock = srcParent.getPath() < destParent.getPath() ? destParent : srcParent\n\n    synchronized(firstLock)\n        synchronized(secondLock)\n            // Safe to modify both folders",
              metadata: { language: "text" },
            },
            {
              id: "d9",
              type: "paragraph",
              content:
                "With consistent ordering, Thread A and Thread B both try to lock the alphabetically-first folder. One gets the lock, the other waits. No circular wait, no deadlock.",
            },
            {
              id: "d10",
              type: "heading",
              content: "Read-Write Locks",
              metadata: { level: 3 },
            },
            {
              id: "d11",
              type: "paragraph",
              content:
                "Operations like get() and list() only read data. A read-write lock allows multiple concurrent readers while giving writers exclusive access. For a file system with heavy read traffic and occasional writes, this significantly improves throughput.",
            },
            {
              id: "d12",
              type: "heading",
              content: "Search Extensibility",
              metadata: { level: 2 },
            },
            {
              id: "d13",
              type: "paragraph",
              content:
                "Basic approach: recursive DFS traversal from any folder, O(n) where n = total entries. Optimized: maintain a Map<string, List<FileSystemEntry>> name index on FileSystem — O(1) search by name. Update the index on create, delete, rename. For prefix search, replace the map with a trie. For content search, build an inverted index (essentially a mini search engine).",
            },
            {
              id: "d14",
              type: "heading",
              content: "What Distinguishes Each Level",
              metadata: { level: 2 },
            },
            {
              id: "d15",
              type: "list",
              content: "",
              metadata: {
                listType: "unordered",
                items: [
                  "Junior: Identify FileSystem, File, Folder. Basic create/delete works with path parsing. Might not think of the shared FileSystemEntry abstraction on their own.",
                  "Mid-level: Proactively extract FileSystemEntry. Understand parent pointers vs stored paths. Move handles parent updates correctly. May need a hint about cycle detection.",
                  "Senior: Proactively discuss parent pointer tradeoff. Cycle detection comes up naturally. Discuss thread safety: check-then-act race, coarse vs fine-grained locking, lock ordering for move deadlock prevention. Thoughts on search indexing.",
                ],
              },
            },
          ],
          readingTime: 10,
        },
      },
    },

    // ═══════════════════════════════════════════════════════
    // QUESTIONS (28 total)
    // ═══════════════════════════════════════════════════════

    // ── MCQ (8 questions) ──

    // MCQ 1 — easy
    {
      title: "Why FileSystem class is needed",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          'A candidate proposes skipping the FileSystem class and just exposing the root Folder, letting callers navigate manually (root.getChild("home").getChild("user")...). What is the primary problem with this approach?',
        explanation:
          'Without a FileSystem orchestrator, every caller must implement path parsing and tree navigation independently. createFile("/home/user/notes.txt") requires splitting the path, walking through each folder, handling missing intermediates, and checking collisions — all duplicated in every call site. The FileSystem class centralizes this logic (Facade pattern), providing a clean path-based API. This is about DRY (Don\'t Repeat Yourself), not encapsulation of Folder internals or performance.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "Every caller must reimplement path parsing and tree navigation — violating DRY and creating a fragile, duplicated API",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Exposing the root breaks encapsulation because callers can modify Folder internals directly",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Without FileSystem, there is no way to create the root Folder at startup",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The root Folder cannot handle more than one level of nesting without a coordinator",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 2 — easy
    {
      title: "Why Map over List for children",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          "Folder stores its children in a Map<string, FileSystemEntry> rather than a List<FileSystemEntry>. What is the primary advantage of the Map?",
        explanation:
          'Path resolution walks the tree level by level, looking up a child by name at each step (e.g., find "home" inside root, then find "user" inside home). With a List, each lookup scans all children — O(n) per level. With a Map keyed by name, lookup is O(1) regardless of sibling count. At scale (tens of thousands of entries with folders containing many files), this difference compounds across every operation. A bonus: maps naturally enforce unique names within a folder since keys must be unique.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "O(1) child lookup by name at each level of path resolution, instead of O(n) scanning with a List",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Maps preserve insertion order, which is important for list operations",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Maps use less memory than Lists because they don't store duplicates",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Maps support concurrent access out of the box, making the system thread-safe",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 3 — easy
    {
      title: "Path entity modeling decision",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcq",
        content:
          'In the file system design, "Path" (e.g., /home/user/docs) is NOT modeled as its own class. Why?',
        explanation:
          'A path is a string that identifies a location — it\'s an input to operations like createFile("/home/user/notes.txt"). It has no state of its own that persists between operations and no behavior beyond being parsed. Path parsing is a utility operation inside FileSystem (resolvePath, resolveParent, extractName), not an entity with lifecycle or methods. Creating a Path class would add an unnecessary abstraction with no behavior.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            {
              id: "a",
              text: "A path is an input string with no persistent state or behavior — it is parsed as a utility operation, not modeled as an entity",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Path is too complex to model as a class because it would need to handle both Unix and Windows formats",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Paths are already represented by the parent pointer chain, so a separate Path class would be redundant",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Creating a Path class would create a circular dependency between Path and FileSystem",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 4 — medium
    {
      title: "Parent pointer vs stored path tradeoff",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          'A candidate stores each entry\'s full path as a string field (e.g., path = "/home/user/notes.txt") instead of using parent pointers. The design works correctly for create, delete, and list. Then the interviewer asks: "What happens when you rename /home to /house?" What is the fundamental problem?',
        explanation:
          'Renaming /home to /house requires updating the stored path string of every descendant under /home — potentially thousands of entries. Each one has a path string containing "/home" that must be changed to "/house". This makes rename O(n) where n is the number of descendants, not O(1). With parent pointers, only the renamed folder\'s name changes, and all descendants automatically have correct paths because getPath() dynamically walks up the tree. The same cascading update problem affects move operations.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Every descendant's stored path string must be updated — rename becomes O(n) where n is the number of descendants, instead of O(1) with parent pointers",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The stored path becomes stale because strings are immutable — the system needs a mutable path object instead",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The hash codes of all descendants change, breaking any external maps that reference these entries",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Path strings consume too much memory for deep hierarchies, causing OutOfMemoryError at scale",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 5 — medium
    {
      title: "Rename implementation pitfall",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "A developer implements rename by simply calling entry.setName(newName) on the target entry. The rename appears to work — entry.getName() returns the new name. But a subsequent get() call using the new path fails with NotFoundException. What went wrong?",
        explanation:
          "The parent folder stores children in a Map<string, FileSystemEntry> keyed by name. Calling setName() changes the entry's internal name but does NOT update the parent's map key. The entry is still stored under the old key in the parent's children map. Path resolution looks up children by name in the map, so the old name still resolves but the new name does not. The correct approach is: removeChild(oldName), entry.setName(newName), addChild(entry) — which updates the map key.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "The parent folder's children map still has the entry stored under the old key — setName doesn't update the map, so the new name cannot be resolved",
              isCorrect: true,
            },
            {
              id: "b",
              text: "setName() doesn't update the parent pointer, so getPath() returns an incorrect path mixing old and new names",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The FileSystem's resolvePath caches path results and the cache wasn't invalidated after the rename",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Renaming an entry changes its identity, so the equals() and hashCode() contracts are violated",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 6 — medium
    {
      title: "Cycle detection necessity in move",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcq",
        content:
          "When moving /home to /home/user/stuff (i.e., moving a folder into its own descendant), the system must detect and reject this as a cycle. How does the cycle detection algorithm work in the file system move operation?",
        explanation:
          "The algorithm walks up from the destination parent toward root using parent pointers. At each step, it checks if the current node is the entry being moved. If it ever finds a match, the move would create a cycle and is rejected. Walking from destParent upward costs O(depth) — much cheaper than traversing the entire subtree downward. This check only applies when moving folders (files cannot have descendants, so they cannot create cycles).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Walk up from the destination parent via parent pointers toward root — if we ever reach the entry being moved, the move would create a cycle",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Perform a DFS from the entry being moved — if the destination appears in the subtree, reject the move",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Compare the string prefixes of srcPath and destPath — if destPath starts with srcPath, it is a cycle",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Maintain a visited set during path resolution — if any node is visited twice, a cycle exists",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 7 — hard
    {
      title: "Fine-grained locking deadlock in move",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          'With fine-grained locking (one lock per folder), Thread A executes move("/alice/file.txt", "/bob/file.txt") while Thread B executes move("/bob/other.txt", "/alice/other.txt") simultaneously. Thread A locks /alice, Thread B locks /bob. What happens next, and what is the standard solution?',
        explanation:
          "Deadlock occurs: Thread A holds /alice's lock and waits for /bob's lock. Thread B holds /bob's lock and waits for /alice's lock. Neither can proceed — classic circular wait. The standard solution is lock ordering: always acquire locks in a consistent, deterministic order (e.g., alphabetical by path). Both threads try to lock /alice first (it comes before /bob alphabetically). One succeeds, the other waits. After the first thread finishes, the second proceeds. No circular wait, no deadlock.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Deadlock — circular wait. Fix with lock ordering: always acquire locks in consistent alphabetical order by path, preventing circular waits",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Livelock — both threads repeatedly release and re-acquire locks. Fix with randomized backoff between retries",
              isCorrect: false,
            },
            {
              id: "c",
              text: "Race condition — one thread overwrites the other's changes. Fix with optimistic concurrency using version numbers",
              isCorrect: false,
            },
            {
              id: "d",
              text: "Priority inversion — the lower-priority thread holds the lock the higher-priority thread needs. Fix with priority inheritance protocol",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCQ 8 — hard
    {
      title: "Deleting non-empty folders implications",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcq",
        content:
          "The file system's delete() allows removing non-empty folders (the entire subtree disappears). A candidate proposes adding a search index (Map<string, List<FileSystemEntry>>) for O(1) name lookup. What subtle problem does deleting non-empty folders create for the search index?",
        explanation:
          "When a non-empty folder is deleted, its entire subtree is removed from the tree. But the search index still contains references to every entry in that subtree. Each descendant must be individually removed from the index — requiring a recursive traversal of the subtree before deletion. Without this cleanup, the index returns stale entries that no longer exist in the tree, and the dangling references prevent garbage collection. This is why the basic design wisely defers the search index to the extensibility section — it significantly complicates delete operations.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Every descendant must be individually removed from the search index — requiring recursive traversal before deletion, or the index returns stale entries",
              isCorrect: true,
            },
            {
              id: "b",
              text: "The search index's HashMap cannot handle concurrent modification during recursive deletion, causing ConcurrentModificationException",
              isCorrect: false,
            },
            {
              id: "c",
              text: "The search index uses weak references that are automatically cleared when entries are deleted, so there is no problem",
              isCorrect: false,
            },
            {
              id: "d",
              text: "The index becomes inconsistent because folder deletion triggers cascading key re-hashing in the HashMap",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── MCAQ (4 questions) ──

    // MCAQ 1 — easy
    {
      title: "Shared properties of File and Folder",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "mcaq",
        content:
          "Which properties and behaviors are shared between File and Folder, justifying the FileSystemEntry abstract base class? Select ALL that apply.",
        explanation:
          "Both File and Folder have a name (every node in the tree has a name), a parent pointer (every node except root has a parent for path computation), and a getPath() method (walks up parent pointers to build the full path). These are extracted into the abstract base class. The children collection is Folder-specific — files are leaf nodes with no children. Content storage is File-specific — folders do not store content.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          options: [
            { id: "a", text: "name field — every tree node has a name", isCorrect: true },
            {
              id: "b",
              text: "parent pointer — every node (except root) references its parent for path computation",
              isCorrect: true,
            },
            {
              id: "c",
              text: "getPath() method — dynamically builds the full path by walking up parent pointers",
              isCorrect: true,
            },
            {
              id: "d",
              text: "children collection — both can contain child entries",
              isCorrect: false,
            },
            { id: "e", text: "content storage — both store string content", isCorrect: false },
          ],
        },
      },
    },

    // MCAQ 2 — medium
    {
      title: "Valid error conditions in createFile",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          'Which of the following are error conditions that createFile("/home/user/notes.txt", "hello") must check? Select ALL that apply.',
        explanation:
          'createFile must check: (1) the parent folder /home/user exists — resolveParent throws NotFoundException if any path component is missing; (2) no entry named "notes.txt" already exists in /home/user — name collisions are rejected; (3) /home/user is actually a folder, not a file — you can\'t create children inside a file. However, checking if the content string is too large is not in our requirements (we store simple string content with no size limit specified), and checking disk space is explicitly out of scope for an in-memory system.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Parent folder /home/user must exist — throw NotFoundException if any intermediate path component is missing",
              isCorrect: true,
            },
            {
              id: "b",
              text: 'No entry named "notes.txt" already exists in /home/user — throw AlreadyExistsException on name collision',
              isCorrect: true,
            },
            {
              id: "c",
              text: "/home/user must be a directory, not a file — throw NotADirectoryException if a file appears as an intermediate path component",
              isCorrect: true,
            },
            {
              id: "d",
              text: "The content string must not exceed a maximum size — throw ContentTooLargeException",
              isCorrect: false,
            },
            {
              id: "e",
              text: "Sufficient disk space must be available — throw InsufficientStorageException",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 3 — medium
    {
      title: "State changes during a move operation",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "mcaq",
        content:
          'When executing move("/home/user/notes.txt", "/home/notes.txt"), which state changes must occur? Select ALL that apply.',
        explanation:
          "A move involves: (1) removing the entry from the source parent's children map (user.removeChild(\"notes.txt\")); (2) adding the entry to the destination parent's children map (home.addChild(entry)); (3) updating the entry's parent pointer from user to home (handled by addChild which calls setParent). In this case, the file name stays \"notes.txt\" so setName is not needed, but in general move can also change the name. The file's content is not affected by a move operation.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          options: [
            {
              id: "a",
              text: "Remove entry from source parent's children map (user folder)",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Add entry to destination parent's children map (home folder)",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Update the entry's parent pointer from user to home",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Update the entry's stored path string from /home/user/notes.txt to /home/notes.txt",
              isCorrect: false,
            },
            {
              id: "e",
              text: "Copy the file's content to the new location and delete the original",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // MCAQ 4 — hard
    {
      title: "Senior-level design considerations for file system",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "mcaq",
        content:
          "Which of the following distinguish a Senior-level answer from a Mid-level answer in a file system LLD interview? Select ALL that apply.",
        explanation:
          "Senior candidates: (1) proactively discuss parent pointer vs stored path tradeoff and explain why dynamic computation wins for rename/move; (2) recognize the cycle detection requirement in move without prompting — moving /home into /home/user creates an impossible loop; (3) discuss thread safety including the check-then-act race, fine-grained locking, and lock ordering for deadlock prevention. However, implementing a B-tree index for range queries is a persistence/database optimization, not relevant to an in-memory tree structure LLD.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          options: [
            {
              id: "a",
              text: "Proactively explaining the parent pointer vs stored path tradeoff with rename/move cost analysis",
              isCorrect: true,
            },
            {
              id: "b",
              text: "Recognizing the cycle detection requirement in move without being prompted",
              isCorrect: true,
            },
            {
              id: "c",
              text: "Discussing thread safety: check-then-act race, coarse vs fine-grained locking, lock ordering for move deadlock",
              isCorrect: true,
            },
            {
              id: "d",
              text: "Implementing a B-tree index on file paths for efficient range queries",
              isCorrect: false,
            },
          ],
        },
      },
    },

    // ── Paragraph (6 questions) ──

    // Paragraph 1 — medium
    {
      title: "Explain the Composite pattern in this design",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'Explain how the Composite pattern emerges in the file system design. Identify the leaf, composite, and component roles. Why is inheritance appropriate here despite the general advice to "prefer composition over inheritance"?',
        explanation:
          "A strong answer identifies: FileSystemEntry = component, File = leaf, Folder = composite. Explains that the pattern emerges from the tree structure where leaves and containers share identity. Justifies inheritance: subtypes genuinely share behavior (not just data), the shared behavior is stable, and both satisfy is-a. The hierarchy won't change because trees always have nodes with names and parents.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'The Composite pattern emerges naturally from the file system\'s tree structure. The three roles are:\n\n- Component (FileSystemEntry): The abstract base class defining the shared interface — name, parent, getPath(), isDirectory(). All code that operates on "any tree node" uses this type.\n- Leaf (File): A terminal node that stores content but cannot contain children. isDirectory() returns false.\n- Composite (Folder): A container node that holds a Map<string, FileSystemEntry> of children — which can be either Files or other Folders. isDirectory() returns true.\n\nThe pattern lets code treat files and folders uniformly. The children collection uses the FileSystemEntry type, so folder operations (addChild, removeChild, getChild) work with any mix of files and subfolders without type checking.\n\nInheritance is appropriate here despite the usual caution because:\n1. File and Folder genuinely share behavior, not just data — getPath() walks up parent pointers identically for both types.\n2. The shared behavior is stable — tree nodes having names and parents is fundamental to what a hierarchical file system is. This won\'t change.\n3. Both satisfy a genuine "is-a" relationship — a File IS a FileSystemEntry, a Folder IS a FileSystemEntry.\n4. The hierarchy is shallow (one level of inheritance) and closed (we won\'t add new entry types frequently).\n\nInheritance goes wrong when used for code reuse between unrelated concepts or when the hierarchy grows deep and unstable. Neither applies here.',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 2 — medium
    {
      title: "Walk through path resolution step by step",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "paragraph",
        content:
          'Given a file system with root → home (folder) → user (folder) → notes.txt (file), trace through the execution of resolvePath("/home/user/notes.txt"). Show each step of the algorithm, what data structure lookup happens at each level, and what would happen if "user" didn\'t exist.',
        explanation:
          'Must trace: split path into ["home","user","notes.txt"], start at root, lookup "home" in root.children map (O(1)), lookup "user" in home.children map (O(1)), lookup "notes.txt" in user.children map (O(1)), return the file. If "user" doesn\'t exist, the getChild("user") call on home returns null, triggering NotFoundException.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          modelAnswer:
            'resolvePath("/home/user/notes.txt") execution:\n\n1. Input validation: path is not null, not empty, starts with "/" ✓\n2. Path is not "/", so not the root special case.\n3. Split: path.substring(1) = "home/user/notes.txt", split("/") = ["home", "user", "notes.txt"]\n4. Set current = root (Folder "/")\n\nIteration 1 (part = "home"):\n- Check: current.isDirectory() → true (root is a Folder) ✓\n- Lookup: current.getChild("home") → Map lookup in root.children, O(1)\n- Result: returns Folder("home")\n- Set current = Folder("home")\n\nIteration 2 (part = "user"):\n- Check: current.isDirectory() → true (home is a Folder) ✓\n- Lookup: current.getChild("user") → Map lookup in home.children, O(1)\n- Result: returns Folder("user")\n- Set current = Folder("user")\n\nIteration 3 (part = "notes.txt"):\n- Check: current.isDirectory() → true (user is a Folder) ✓\n- Lookup: current.getChild("notes.txt") → Map lookup in user.children, O(1)\n- Result: returns File("notes.txt")\n- Set current = File("notes.txt")\n\n5. Loop complete. Return current = File("notes.txt") ✓\n\nTotal time: O(depth) = O(3), with O(1) map lookup at each level.\n\nError case — if "user" didn\'t exist:\nIn iteration 2, current.getChild("user") returns null (key not in home\'s children map). The algorithm immediately throws NotFoundException("Path not found: /home/user/notes.txt"). It does not continue to the next path component.',
          minLength: 150,
          maxLength: 2000,
        },
      },
    },

    // Paragraph 3 — hard
    {
      title: "Trace through move with cycle detection",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'Given: root → home (folder) → user (folder) → docs (folder). Trace through move("/home", "/home/user/stuff") step by step. Show the cycle detection algorithm executing, explain what would happen if cycle detection were missing, and describe the resulting tree state if the move were (incorrectly) allowed.',
        explanation:
          "Must show: resolve srcParent=root, entry=home, destParent=user, then cycle check walks up from user → home → detects entry == home → throws. Without detection: home would be removed from root and added to user, but home is user's ancestor — creating an orphaned self-referencing subtree disconnected from root, with parent pointers forming an infinite loop.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'move("/home", "/home/user/stuff") execution:\n\n1. srcParent = resolveParent("/home") → root\n2. srcName = extractName("/home") → "home"\n3. entry = root.getChild("home") → Folder("home") ✓\n4. destParent = resolveParent("/home/user/stuff") → resolvePath("/home/user") → Folder("user")\n5. destName = extractName("/home/user/stuff") → "stuff"\n\n6. Cycle detection (entry is a directory):\n   - current = destParent = Folder("user")\n   - Iteration 1: current == entry? user == home? NO\n   - current = user.getParent() = Folder("home")\n   - Iteration 2: current == entry? home == home? YES → CYCLE DETECTED\n   - Throw InvalidPathException("Cannot move folder into itself")\n\nThe move is correctly rejected.\n\nIf cycle detection were missing, the following would execute:\n- root.removeChild("home") → home removed from root, home.parent = null\n- entry.setName("stuff") → home renamed to "stuff"\n- user.addChild(entry) → "stuff" (formerly home) added as child of user, stuff.parent = user\n\nResulting broken state:\n- root.children = {} (empty — home was removed)\n- user is a child of stuff (formerly home), and stuff is now a child of user\n- Parent pointer loop: stuff.parent = user, user.parent = stuff\n- The entire subtree is disconnected from root — unreachable via any path from "/"\n- getPath() on any node in this subtree would infinite-loop: stuff asks user for path, user asks stuff for path, endlessly\n\nThis demonstrates why cycle detection is essential — without it, the tree invariant (single root, no cycles) is violated, causing infinite loops and data loss.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 4 — hard
    {
      title: "Design thread-safe createFile",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'Two threads simultaneously call createFile("/home/notes.txt", "hello") and createFile("/home/notes.txt", "world"). Show the race condition timeline, explain the check-then-act problem, and compare coarse-grained vs fine-grained locking solutions with their tradeoffs.',
        explanation:
          "Must show: both threads resolve parent, both check hasChild → false, both addChild → data corruption. Explain check-then-act is not atomic. Coarse-grained: synchronized(this) on FileSystem — simple, correct, but serializes all operations. Fine-grained: synchronized(parent folder) — allows parallel operations on different folders but introduces deadlock risk for move.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Race condition timeline:\n1. Thread A: resolveParent("/home/notes.txt") → home folder\n2. Thread B: resolveParent("/home/notes.txt") → home folder\n3. Thread A: home.hasChild("notes.txt") → false ✓\n4. Thread B: home.hasChild("notes.txt") → false ✓ (still false — A hasn\'t added yet)\n5. Thread A: home.addChild(File("notes.txt", "hello")) → succeeds\n6. Thread B: home.addChild(File("notes.txt", "world")) → silent overwrite or map corruption\n\nThe check-then-act problem: hasChild (check) and addChild (act) are not atomic. Between Thread A\'s check and its add, Thread B executes its own check and sees stale state. This is a textbook TOCTOU (time-of-check-to-time-of-use) vulnerability.\n\nCoarse-grained locking:\n```\ncreateFile(path, content)\n    synchronized(this)  // Lock entire FileSystem\n        parent = resolveParent(path)\n        if parent.hasChild(fileName) throw AlreadyExistsException\n        parent.addChild(File(fileName, content))\n```\nPros: Simple, correct, impossible to deadlock (single lock).\nCons: Serializes ALL operations. Thread creating /alice/file1.txt blocks thread creating /bob/file2.txt even though they touch different folders. Throughput = 1 operation at a time.\n\nFine-grained locking:\n```\ncreateFile(path, content)\n    parent = resolveParent(path)\n    synchronized(parent)  // Lock only the parent folder\n        if parent.hasChild(fileName) throw AlreadyExistsException\n        parent.addChild(File(fileName, content))\n```\nPros: Threads creating in different folders run in parallel. Much better throughput.\nCons: move() must lock TWO folders (source and destination). If two threads move in opposite directions, circular wait → deadlock. Requires lock ordering (alphabetical by path) to prevent deadlock.\n\nFor interview scope, present coarse-grained as the baseline and mention fine-grained + lock ordering as the optimization. Read-write locks can further improve throughput for read-heavy workloads (get, list don\'t mutate, so they can run concurrently).',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 5 — hard
    {
      title: "Compare interface vs abstract class for FileSystemEntry",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          "Compare using an interface versus an abstract base class for FileSystemEntry. For each approach, explain what is shared and what is duplicated. Then explain why the abstract class is the stronger choice for this specific design, referencing the conditions under which inheritance is appropriate.",
        explanation:
          "Must cover: interface defines contract but doesn't share implementation — both classes need their own name field and getName(). Abstract class shares state (name, parent) and behavior (getPath, getName). Inheritance conditions: subtypes share behavior (not just data), behavior is stable, genuine is-a relationship. Should mention this is appropriate because the hierarchy is shallow and closed.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            "Interface approach:\n```\ninterface FileSystemEntry:\n    getName() -> string\n    getPath() -> string\n    isDirectory() -> boolean\n```\nWhat it provides: A shared type for the children collection (Map<string, FileSystemEntry>). Polymorphic operations — code can call getName() on any entry without knowing if it's a File or Folder.\n\nWhat it duplicates: Both File and Folder must independently implement:\n- name field and getName()/setName()\n- parent field and getParent()/setParent()\n- getPath() — identical logic in both classes (walk up parent pointers)\n\nThat's 3 fields and 5 methods duplicated. If we add any shared logic (e.g., path caching), we add it in two places.\n\nAbstract class approach:\n```\nabstract class FileSystemEntry:\n    - name: string\n    - parent: Folder?\n    + getName(), setName(), getParent(), setParent()\n    + getPath()  // shared implementation\n    + abstract isDirectory()\n```\nWhat it shares: All common state AND behavior. File and Folder only implement what's unique to them — File adds content, Folder adds children. getPath() is written once.\n\nWhy abstract class is stronger here:\n1. Shared behavior, not just shared data: getPath() contains real logic (recursive parent traversal with root special case). An interface would force identical implementations in both classes.\n2. Stable behavior: Tree nodes having names and parents is fundamental to hierarchical data structures. This won't change.\n3. Genuine is-a: A File IS a FileSystemEntry. A Folder IS a FileSystemEntry. This isn't a forced hierarchy — it reflects the domain model.\n4. Shallow and closed: One level of inheritance, two concrete subclasses. We're not building an extensible framework with unknown future types.\n\nWhen would an interface be better? If FileSystemEntry needed to compose with another hierarchy (multiple inheritance scenario), or if the \"shared\" behavior was actually different per type (violating Liskov Substitution). Neither applies here.",
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // Paragraph 6 — hard
    {
      title: "Design search functionality extension",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "paragraph",
        content:
          'The interviewer asks: "How would you add search functionality to find files by name?" Describe both a naive approach and an optimized approach. For the optimized approach, show how the index is maintained during create, delete, and rename operations. Discuss the tradeoff and when you would choose each.',
        explanation:
          "Must cover: naive = recursive DFS O(n); optimized = Map<string, List<FileSystemEntry>> giving O(1) by name. Index maintenance: add on create, remove on delete (including recursive removal for non-empty folders), update on rename. Tradeoff: O(n) is fine for infrequent searches, index is worth it for frequent searches but adds complexity to every mutation.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          modelAnswer:
            'Naive approach — Recursive DFS:\n```\nsearch(startFolder, searchName)\n    results = []\n    for entry in startFolder.getChildren()\n        if entry.getName() == searchName\n            results.add(entry)\n        if entry.isDirectory()\n            results.addAll(search(entry, searchName))\n    return results\n```\nTime: O(n) where n = total entries in subtree. Space: O(depth) for recursion stack.\nPros: Zero additional state, no maintenance burden.\nCons: Slow for large file systems with frequent searches.\n\nOptimized approach — Name index:\nAdd to FileSystem: nameIndex: Map<string, List<FileSystemEntry>>\n\nCreate maintenance:\n```\ncreateFile(path, content)\n    // ... existing logic ...\n    file = File(fileName, content)\n    parent.addChild(file)\n    nameIndex.getOrDefault(fileName, []).add(file)  // Index update\n```\n\nDelete maintenance (this is the tricky part):\n```\ndelete(path)\n    entry = parent.getChild(name)\n    parent.removeChild(name)\n    removeFromIndex(entry)  // Must handle subtrees!\n\nremoveFromIndex(entry)\n    nameIndex.get(entry.getName()).remove(entry)\n    if entry.isDirectory()\n        for child in entry.getChildren()\n            removeFromIndex(child)  // Recursive for non-empty folders\n```\nDeleting a non-empty folder requires recursively removing every descendant from the index — this is O(subtree size).\n\nRename maintenance:\n```\nrename(path, newName)\n    // ... existing validation ...\n    nameIndex.get(oldName).remove(entry)  // Remove from old key\n    // ... rename logic ...\n    nameIndex.getOrDefault(newName, []).add(entry)  // Add to new key\n```\n\nSearch becomes O(1):\n```\nsearch(name) -> nameIndex.getOrDefault(name, [])\n```\n\nTradeoff analysis:\n- Use naive DFS when: Search is infrequent (ad-hoc user queries). The maintenance cost on every create/delete/rename is not worth it. Simpler code, fewer bugs.\n- Use name index when: Search is a frequent operation (e.g., autocomplete, find-by-name in an IDE). The O(1) lookup justifies the maintenance overhead. Accept the complexity in delete (recursive index cleanup for subtrees).\n\nFurther extensions: Trie for prefix search ("config*"), inverted index on file content for content search. Each adds progressively more maintenance complexity.',
          minLength: 200,
          maxLength: 3000,
        },
      },
    },

    // ── Text (4 questions) ──

    // Text 1 — medium
    {
      title: "Design pattern in FileSystem class",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          'The FileSystem class hides the complexity of tree navigation behind a simple path-based API (e.g., createFile("/home/user/notes.txt")). What design pattern does this represent? Name the pattern and explain in one sentence why it applies.',
        explanation:
          "Facade pattern — FileSystem provides a unified, simplified interface (path-based operations) that hides the internal complexity (tree traversal, path parsing, parent-child management) from clients. Callers interact with one class instead of navigating the Folder/File tree manually.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Facade — FileSystem provides a simplified path-based interface that hides the complexity of tree navigation, path parsing, and parent-child management from callers.",
          acceptableAnswers: ["Facade", "facade", "Façade"],
          caseSensitive: false,
        },
      },
    },

    // Text 2 — medium
    {
      title: "Race condition type in createFile",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "text",
        content:
          "When two threads simultaneously call createFile for the same path, both pass the hasChild check before either adds the child. What is the specific name for this type of race condition? (Hint: it involves a gap between checking a condition and acting on it.)",
        explanation:
          "This is a check-then-act (or TOCTOU — Time-Of-Check-To-Time-Of-Use) race condition. The check (hasChild → false) and the action (addChild) are not atomic, allowing another thread to invalidate the check result before the action executes.",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          correctAnswer:
            "Check-then-act (also called TOCTOU — Time-Of-Check-To-Time-Of-Use). The check and action are not atomic, so another thread can invalidate the check before the action executes.",
          acceptableAnswers: [
            "check-then-act",
            "TOCTOU",
            "time of check time of use",
            "check then act",
            "toctou",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 3 — hard
    {
      title: "Why getChildren returns a copy",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "Folder.getChildren() returns new List(children.values()) rather than exposing the internal children map or its values view directly. What specific problem does this defensive copy prevent?",
        explanation:
          "A defensive copy prevents callers from directly modifying Folder's internal children collection — adding or removing entries without going through addChild/removeChild, which would bypass parent pointer maintenance and name collision checks. Without the copy, a caller could corrupt the bidirectional parent-child relationship by modifying the collection without updating parent pointers.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "It prevents external code from modifying the children collection directly, bypassing addChild/removeChild which maintain bidirectional parent pointer consistency and enforce name uniqueness.",
          acceptableAnswers: [
            "defensive copy",
            "prevent modification",
            "parent pointer",
            "encapsulation",
            "bidirectional",
          ],
          caseSensitive: false,
        },
      },
    },

    // Text 4 — hard
    {
      title: "Bidirectional reference maintenance",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "text",
        content:
          "In the file system design, children point to parents (via parent pointer) and parents point to children (via children map). When moving an entry to a new folder, what specific sequence of operations maintains bidirectional consistency, and what breaks if you forget to clear the old parent pointer?",
        explanation:
          "Sequence: (1) srcParent.removeChild(name) — removes from old parent's map AND sets entry.parent = null; (2) destParent.addChild(entry) — adds to new parent's map AND sets entry.parent = destParent. If removeChild doesn't clear the parent pointer, the entry temporarily points to its old parent while living in the new parent's map. getPath() would walk up to the old parent, producing an incorrect path.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          correctAnswer:
            "removeChild clears entry.parent to null, then addChild sets entry.parent to the new folder. If the old parent pointer isn't cleared, getPath() walks up to the wrong parent, producing an incorrect path string.",
          acceptableAnswers: [
            "removeChild",
            "addChild",
            "parent pointer",
            "getPath",
            "incorrect path",
          ],
          caseSensitive: false,
        },
      },
    },

    // ── Matching (3 questions) ──

    // Matching 1 — easy
    {
      title: "Match entities to their responsibilities",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "matching",
        content: "Match each file system class to its primary responsibility:",
        explanation:
          "FileSystem is the orchestrator — it owns the public API, parses paths, and coordinates operations. FileSystemEntry captures shared identity (name, parent, path) as an abstract base. Folder manages containment — its children map and add/remove operations. File stores content — it is a leaf node with no containment logic.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "FileSystem",
              right:
                "Orchestrator — owns the public API, parses paths, coordinates tree operations",
            },
            {
              id: "p2",
              left: "FileSystemEntry",
              right:
                "Abstract base — captures shared identity (name, parent, getPath) for all tree nodes",
            },
            {
              id: "p3",
              left: "Folder",
              right:
                "Container — manages children map with addChild, removeChild, getChild operations",
            },
            {
              id: "p4",
              left: "File",
              right: "Leaf node — stores string content with no children or containment logic",
            },
          ],
        },
      },
    },

    // Matching 2 — medium
    {
      title: "Match operations to their error conditions",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "matching",
        content:
          "Match each FileSystem operation to its most distinctive error condition (the one unique to that operation, not shared with others):",
        explanation:
          'createFile rejects path "/" because you cannot create a file at root. delete rejects deleting root because the root folder anchors the entire tree. rename validates the new name doesn\'t contain "/" (forward slashes are path separators, not valid name characters). move must check for cycles — the only operation that can create an impossible self-referencing loop.',
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: 'createFile("/")',
              right: "Throws InvalidPathException — cannot create a file at root",
            },
            {
              id: "p2",
              left: 'delete("/")',
              right: "Throws InvalidPathException — cannot delete the root folder",
            },
            {
              id: "p3",
              left: 'rename(path, "a/b")',
              right: "Throws InvalidPathException — name cannot contain forward slashes",
            },
            {
              id: "p4",
              left: 'move("/home", "/home/user/x")',
              right:
                "Throws InvalidPathException — cannot move a folder into its own descendant (cycle)",
            },
          ],
        },
      },
    },

    // Matching 3 — hard
    {
      title: "Match concurrency strategies to their tradeoffs",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "hard",
      payload: {
        questionType: "matching",
        content: "Match each concurrency strategy for the file system to its primary tradeoff:",
        explanation:
          "No locking is fast but causes data corruption under concurrent access. Coarse-grained locking (single lock on FileSystem) is correct but serializes all operations — zero parallelism. Fine-grained locking (per-folder) allows parallel operations on different folders but requires lock ordering to prevent deadlock in move. Read-write locks improve read throughput but add complexity with write starvation risk under heavy read load.",
        basePoints: 25,
        difficulty: "hard",
        questionData: {
          pairs: [
            {
              id: "p1",
              left: "No locking",
              right: "Maximum throughput, but data corruption from check-then-act races",
            },
            {
              id: "p2",
              left: "Coarse-grained lock (single mutex)",
              right: "Correct and simple, but serializes ALL operations including independent ones",
            },
            {
              id: "p3",
              left: "Fine-grained lock (per-folder)",
              right:
                "Parallel access to different folders, but deadlock risk in move requiring lock ordering",
            },
            {
              id: "p4",
              left: "Read-write lock",
              right:
                "Multiple concurrent readers, but added complexity and potential write starvation",
            },
          ],
        },
      },
    },

    // ── Fill-blanks (3 questions) ──

    // Fill-blanks 1 — easy
    {
      title: "Children collection data structure",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "Folder stores its children in a _____ keyed by name, providing O(1) child lookup. This data structure also naturally enforces _____ names within a folder since keys must be unique.",
        explanation:
          'A Map (or HashMap/Dictionary) keyed by name provides O(1) lookup by name. Since map keys must be unique, this automatically prevents duplicate names — two entries cannot have the same name in the same folder. This is a "pit of success" design where the data structure itself enforces the invariant.',
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "Folder stores its children in a {{blank1}} keyed by name, providing O(1) child lookup. This data structure also naturally enforces {{blank2}} names within a folder since keys must be unique.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "Map",
              acceptableAnswers: ["Map", "map", "HashMap", "hashmap", "Dictionary", "dictionary"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "unique",
              acceptableAnswers: ["unique", "distinct"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 2 — easy
    {
      title: "Composite pattern roles",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "easy",
      payload: {
        questionType: "fill-blanks",
        content:
          "In the Composite pattern used in this design, File is the _____ (cannot contain children), Folder is the _____ (contains children), and FileSystemEntry is their shared component interface.",
        explanation:
          "In the Composite pattern: the leaf is a terminal node that cannot contain children (File), the composite is a container that holds other components (Folder). Both share a common interface (FileSystemEntry) so tree operations can treat them uniformly.",
        basePoints: 10,
        difficulty: "easy",
        questionData: {
          textWithBlanks:
            "In the Composite pattern used in this design, File is the {{blank1}} (cannot contain children), Folder is the {{blank2}} (contains children), and FileSystemEntry is their shared component interface.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "leaf",
              acceptableAnswers: ["leaf", "Leaf"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "composite",
              acceptableAnswers: ["composite", "Composite"],
              caseSensitive: false,
            },
          ],
        },
      },
    },

    // Fill-blanks 3 — medium
    {
      title: "Path computation approach",
      type: "question",
      sectionId: "sec_questions",
      difficulty: "medium",
      payload: {
        questionType: "fill-blanks",
        content:
          "Instead of storing the full path as a string, each entry stores a _____ pointer. getPath() walks up to the root in O(_____) time, where the variable represents the nesting depth of the entry.",
        explanation:
          "Each entry stores a parent pointer (reference to its parent Folder). getPath() recursively walks up the parent chain collecting names, taking O(depth) time where depth is the number of levels from root to the entry. The tradeoff: getPath() is O(depth) instead of O(1), but rename/move become O(1) instead of O(n descendants).",
        basePoints: 15,
        difficulty: "medium",
        questionData: {
          textWithBlanks:
            "Instead of storing the full path as a string, each entry stores a {{blank1}} pointer. getPath() walks up to the root in O({{blank2}}) time, where the variable represents the nesting depth of the entry.",
          blanks: [
            {
              id: "blank1",
              correctAnswer: "parent",
              acceptableAnswers: ["parent", "Parent"],
              caseSensitive: false,
            },
            {
              id: "blank2",
              correctAnswer: "depth",
              acceptableAnswers: ["depth", "d", "h", "height"],
              caseSensitive: false,
            },
          ],
        },
      },
    },
  ],
};
