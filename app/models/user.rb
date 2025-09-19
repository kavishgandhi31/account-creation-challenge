require 'zxcvbn'

class User < ApplicationRecord
  has_secure_password
  
  validates :username, presence: true, length: { in: 10..50 }
  validates :password, presence: true, length: { in: 20..50 }
  validate :username_validation
  validate :password_validation

  def username_validation
    unless username =~ /\A[a-zA-Z0-9_-]+\z/
      errors.add(:username, "can only contain letters, numbers, underscores, and hyphens")
    end
    if username != username&.strip
      errors.add(:username, "cannot have leading or trailing spaces")
    end
  end

  def password_validation
    unless password =~ /[a-zA-Z]/ && password =~ /[0-9]/
      errors.add(:password, "must contain at least 1 letter and 1 number.")
    end
    if password.present?
      score = ::Zxcvbn.test(password).score
      if score < 2
        errors.add(:password, "is too weak (zxcvbn score < 2).")
      end
    end
  end
end
