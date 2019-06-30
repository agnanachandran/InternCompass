class CompanyCategory < ActiveRecord::Base
  has_many :company_to_company_categories, dependent: :destroy
  validates :name, presence: true

  def self.add_additional_company_categories
    company_categories_json = JSON.parse(File.read("#{Rails.root.to_s}/db/company_categories.json"))
    categories = company_categories_json['categories']
    output = ''
    categories.each do |category|
      category_db = CompanyCategory.find_by_name(category)
      output += "Created company category: #{category}\n"
      if category_db.nil?
        output += "Created company category: #{category}\n"
        CompanyCategory.create(name: category)
      end
    end
    puts output
  end
end
