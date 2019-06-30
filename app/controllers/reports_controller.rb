class ReportsController < ApplicationController

  def critique
    critique_token = params.require(:critique_token)
    get_admin_users().each do |u|
      notification = Notification.new(
        content: {critique_token: critique_token},
        user_id: u.id,
        notifier_id: current_user.id,
        category: Notification.categories['report_critique'],
      )
      notification.save
    end
    respond_to do |format|
      format.json { head :ok, content_type: 'text/html' }
    end
  end

  def critique_comment
    critique_comment_id = params.require(:comment_id)
    get_admin_users().each do |u|
      notification = Notification.new(
        content: {critique_comment_id: critique_comment_id},
        user_id: u.id,
        notifier_id: current_user.id,
        category: Notification.categories['report_critique_comment'],
      )
      notification.save
    end
    respond_to do |format|
      format.json { head :ok, content_type: 'text/html' }
    end
  end

  private
  def get_admin_users
    return User.where(admin: true).all
  end

end

