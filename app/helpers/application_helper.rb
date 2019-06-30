module ApplicationHelper
  def render_component(props={})
    if props.nil?
      props={}
    end
    props[:compass_store] = {
      current_user: current_user,
      notifications: Notification.get_notifications_for_user(current_user),
      is_development: !Rails.env.production?
    }
    react_component("CompassApp", props: props)
  end
end
