/**
 * MetricsService stub — tracks user engagement events.
 * Implementation will be wired to the analytics backend.
 */

interface TrackParams {
  courseId?: string;
  storyPointId?: string;
  itemId?: string;
  userId?: string | null;
}

const MetricsService = {
  async trackCourseView(_params: TrackParams): Promise<void> {},
  async trackItemView(_params: TrackParams): Promise<void> {},
  async trackStoryPointView(_params: TrackParams): Promise<void> {},
  async trackStoryPointCompleted(_params: TrackParams): Promise<void> {},
  async trackChatInteraction(_params: TrackParams): Promise<void> {},
  async trackQuestionSubmitted(_params: TrackParams): Promise<void> {},
  async trackQuestionCompleted(_params: TrackParams): Promise<void> {},
  async trackWrongSubmission(_params: TrackParams): Promise<void> {},
};

export default MetricsService;
