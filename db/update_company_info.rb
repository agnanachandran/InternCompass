# rails runner db/update_company_info.rb

stream = File.open(ENV['COMPANIES_JSON_PATH'] || "#{Rails.root.to_s}/db/companies.json")
names_to_companies = JSON::Stream::Parser.parse(stream)
companies = Company.where("description IS NULL or website_url IS NULL or logo_url IS NULL or hq_city is NULL or hq_region is NULL or hq_country is NULL")

companies.each do |c|
  cb_company = names_to_companies[c.name]
  if cb_company.blank?
    next
  end
  update = false

  if c.description == nil
    c.description = cb_company['description']
    update = (c.description != nil)
  end

  if c.website_url == nil
    c.website_url = cb_company['website_url']
    update = (c.website_url != nil)
  end

  if c.logo_url == nil
    logo_url = cb_company['logo_url']
    if !logo_url.blank?
      logo_url = Net::HTTP.get_response(URI(logo_url))['location']
      if !logo_url.blank?
        c.logo_url = logo_url.sub "upload/", "upload/c_pad,w_%d,h_%d/" % [150, 150]
        update = true
      end
    end
  end

  if c.hq_city == nil
    c.hq_city = cb_company['hq_city']
    update = (c.hq_city != nil)
  end

  if c.hq_region == nil
    c.hq_region = cb_company['hq_region']
    update = (c.hq_region != nil)
  end

  if c.hq_country == nil
    c.hq_country = cb_company['hq_country']
    update = (c.hq_country != nil)
  end
  
  if update
    puts "Updated " + c.name
    c.save
  end
end
