module AutoIncModule
  extend ActiveSupport::Concern

  def self.included base
    base.before_validation(on: :create) do
      self.id = next_seq unless attribute_present?("#{self.class.name.downcase}_id")
    end
  end

  def next_seq
    result = ActiveRecord::Base.connection.execute("SELECT nextval('#{self.class.name.downcase}_id_seq')")
    result[0]['nextval']
  end
end