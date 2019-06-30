class CompanyToCompanyCategory < ActiveRecord::Base
  belongs_to :company_category
  belongs_to :company

  validates_presence_of :company, :company_category
  validates_uniqueness_of :company_id, scope: :company_category_id
end
