class AddSiteLogoToCompanies < ActiveRecord::Migration
  def change
    change_table :companies do |t|
      t.string :website_url, :logo_url
    end
  end
end
