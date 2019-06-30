class NotificationsController < ApplicationController

  def index
    render json: {
      notifications: Notification.get_notifications_for_user(current_user),
    }
  end

  def mark_as_seen
    mark_as_seen_before_id = params[:mark_as_seen_before_id]
    Notification.where(user_id: current_user.id)
      .where("#{Notification.table_name}.id <= ?", mark_as_seen_before_id.to_i)
      .update_all(seen: true)
    respond_to do |format|
      format.json { head :ok, content_type: 'text/html' }
    end
  end

end
