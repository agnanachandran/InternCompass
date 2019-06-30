class Notification < ActiveRecord::Base
  belongs_to :user, :class_name => 'User'
  belongs_to :notifier, :class_name => 'User'

  # Keep in sync with frontend constants file
  enum category: [
    :critique_comment,
    :report_critique,
    :report_critique_comment
  ]

  def self.get_notifications_for_user(user)
    if user.present?
      notifications = self.where(user_id: user.id).order(:created_at).reverse_order.limit(5)
      return notifications.map do |notification|
        if notification.critique_comment?
          {
            id: notification.id,
            notifier: User.find_by_id(notification.notifier_id).get_public_user_info(),
            category: notification.category,
            critique_token: notification.content['critique_token'],
            seen: notification.seen,
            created_at: notification.created_at,
          }
        elsif notification.report_critique?
          {
            id: notification.id,
            notifier: User.find_by_id(notification.notifier_id).get_public_user_info(),
            category: notification.category,
            critique_token: notification.content['critique_token'],
            seen: notification.seen,
            created_at: notification.created_at,
          }
        elsif notification.report_critique_comment?
          critique_comment = CritiqueComment.find_by_id(notification.content['critique_comment_id'])
          if critique_comment.nil?
            {
              id: notification.id,
              notifier: User.find_by_id(notification.notifier_id).get_public_user_info(),
              category: notification.category,
              critique_token: nil,
              critique_comment_id: notification.content['critique_comment_id'],
              seen: notification.seen,
              created_at: notification.created_at,
            }
          else
            {
              id: notification.id,
              notifier: User.find_by_id(notification.notifier_id).get_public_user_info(),
              category: notification.category,
              critique_token: critique_comment.critique.token,
              critique_comment_id: notification.content['critique_comment_id'],
              seen: notification.seen,
              created_at: notification.created_at,
            }
          end
        end
      end
    end
    return nil
  end
end

