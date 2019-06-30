class Utils
  def self.slugify(string, sep='-')
    string
      .downcase
      .strip
      .gsub(/[^0-9a-z ]/i, '') # remove all nonalphanumeric and nonspace characters
      .gsub(/\s+/, sep) # convert all whitespace to separator
  end

  def self.clean_format(string)
    string
      .downcase
      .gsub(/\s+/, ' ')
      .strip
      .titleize
  end
end