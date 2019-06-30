class JobCompanyValidator < ActiveModel::Validator
  def validate(record)
    if record.job.company != record.company
      record.errors[:base] << 'Provided job does not belong to provided company'
    end
  end
end