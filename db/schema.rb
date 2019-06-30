# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170921081216) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "companies", force: :cascade do |t|
    t.string   "name",                               null: false
    t.integer  "size"
    t.text     "description"
    t.datetime "deleted_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "website_url"
    t.string   "logo_url"
    t.string   "slug"
    t.integer  "user_reviews_count", default: 0,     null: false
    t.float    "total_rating",       default: 0.0
    t.float    "avg_rating"
    t.string   "hq_city"
    t.string   "hq_region"
    t.string   "hq_country"
    t.boolean  "approved",           default: false, null: false
    t.string   "careers_url"
  end

  add_index "companies", ["approved"], name: "index_companies_on_approved", using: :btree
  add_index "companies", ["avg_rating"], name: "index_companies_on_avg_rating", using: :btree
  add_index "companies", ["name"], name: "index_companies_on_name", unique: true, using: :btree
  add_index "companies", ["slug"], name: "index_companies_on_slug", unique: true, using: :btree
  add_index "companies", ["user_reviews_count"], name: "index_companies_on_user_reviews_count", using: :btree

  create_table "company_categories", force: :cascade do |t|
    t.string "name", null: false
  end

  add_index "company_categories", ["name"], name: "index_company_categories_on_name", unique: true, using: :btree

  create_table "company_to_company_categories", force: :cascade do |t|
    t.integer "company_id"
    t.integer "company_category_id"
  end

  add_index "company_to_company_categories", ["company_category_id"], name: "index_company_to_company_categories_on_company_category_id", using: :btree
  add_index "company_to_company_categories", ["company_id", "company_category_id"], name: "company_to_company_categories_index", unique: true, using: :btree
  add_index "company_to_company_categories", ["company_id"], name: "index_company_to_company_categories_on_company_id", using: :btree

  create_table "critique_comments", force: :cascade do |t|
    t.integer  "critique_id"
    t.integer  "user_id"
    t.string   "text"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "critiques", force: :cascade do |t|
    t.text     "description"
    t.integer  "user_id",     null: false
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "token"
  end

  add_index "critiques", ["token"], name: "index_critiques_on_token", using: :btree
  add_index "critiques", ["user_id"], name: "index_critiques_on_user_id", using: :btree

  create_table "curated_recent_reviews", force: :cascade do |t|
    t.integer "user_review_id"
  end

  create_table "feedbacks", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.text     "comment"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "following_companies", force: :cascade do |t|
    t.integer  "company_id", null: false
    t.integer  "user_id",    null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "following_companies", ["company_id", "user_id"], name: "index_following_companies_on_company_id_and_user_id", unique: true, using: :btree

  create_table "interview_question_tags", force: :cascade do |t|
    t.string "name",     null: false
    t.string "url_slug"
  end

  add_index "interview_question_tags", ["name"], name: "index_interview_question_tags_on_name", unique: true, using: :btree
  add_index "interview_question_tags", ["url_slug"], name: "index_interview_question_tags_on_url_slug", unique: true, using: :btree

  create_table "interview_questions", force: :cascade do |t|
    t.string   "title",                                 null: false
    t.text     "description_markdown",                  null: false
    t.integer  "job_id"
    t.datetime "deleted_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "difficulty",           default: "easy", null: false
  end

  create_table "jobs", force: :cascade do |t|
    t.string   "title",                                              null: false
    t.integer  "min_salary_in_cents"
    t.integer  "max_salary_in_cents"
    t.integer  "avg_salary_in_cents"
    t.integer  "company_id",                                         null: false
    t.datetime "deleted_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.float    "avg_rating"
    t.string   "slug"
    t.string   "location"
    t.float    "total_rating",                         default: 0.0
    t.decimal  "total_salary_in_cents", precision: 15, default: 0
  end

  add_index "jobs", ["company_id", "title", "location"], name: "index_jobs_on_company_id_and_title_and_location", unique: true, using: :btree
  add_index "jobs", ["company_id"], name: "index_jobs_on_company_id", using: :btree
  add_index "jobs", ["slug"], name: "index_jobs_on_slug", using: :btree

  create_table "notifications", force: :cascade do |t|
    t.json     "content",                     null: false
    t.integer  "category",                    null: false
    t.integer  "user_id",                     null: false
    t.integer  "notifier_id"
    t.boolean  "seen",        default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "notifications", ["user_id"], name: "index_notifications_on_user_id", using: :btree

  create_table "perk_tags", force: :cascade do |t|
    t.string "name", null: false
  end

  add_index "perk_tags", ["name"], name: "index_perk_tags_on_name", unique: true, using: :btree

  create_table "question_to_tags", force: :cascade do |t|
    t.integer "interview_question_id",     null: false
    t.integer "interview_question_tag_id", null: false
  end

  add_index "question_to_tags", ["interview_question_id", "interview_question_tag_id"], name: "question_to_tags_index", unique: true, using: :btree
  add_index "question_to_tags", ["interview_question_id"], name: "index_question_to_tags_on_interview_question_id", using: :btree
  add_index "question_to_tags", ["interview_question_tag_id"], name: "index_question_to_tags_on_interview_question_tag_id", using: :btree

  create_table "resumes", force: :cascade do |t|
    t.integer  "critique_id"
    t.string   "s3_key"
    t.string   "file_name"
    t.integer  "size_in_bytes"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "resumes", ["critique_id"], name: "index_resumes_on_critique_id", unique: true, using: :btree

  create_table "review_comments", force: :cascade do |t|
    t.string   "text",           null: false
    t.integer  "user_review_id", null: false
    t.integer  "user_id",        null: false
    t.datetime "deleted_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "review_comments", ["user_id"], name: "index_review_comments_on_user_id", using: :btree
  add_index "review_comments", ["user_review_id"], name: "index_review_comments_on_user_review_id", using: :btree

  create_table "user_preferences", force: :cascade do |t|
    t.integer  "user_id"
    t.datetime "deteled_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "user_profiles", force: :cascade do |t|
    t.string   "summary"
    t.integer  "user_id"
    t.datetime "deleted_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "school"
    t.string   "program"
    t.string   "personal_website"
    t.string   "github"
    t.string   "linkedin"
    t.string   "twitter"
    t.string   "blog"
    t.string   "dribbble"
    t.string   "bio"
  end

  create_table "user_review_spams", force: :cascade do |t|
    t.integer "admin_id"
    t.string  "reason"
  end

  add_index "user_review_spams", ["admin_id"], name: "index_user_review_spams_on_admin_id", using: :btree

  create_table "user_review_to_perk_tags", force: :cascade do |t|
    t.integer "user_review_id", null: false
    t.integer "perk_tag_id",    null: false
  end

  add_index "user_review_to_perk_tags", ["perk_tag_id"], name: "index_user_review_to_perk_tags_on_perk_tag_id", using: :btree
  add_index "user_review_to_perk_tags", ["user_review_id", "perk_tag_id"], name: "user_review_to_perk_tags_index", unique: true, using: :btree
  add_index "user_review_to_perk_tags", ["user_review_id"], name: "index_user_review_to_perk_tags_on_user_review_id", using: :btree

  create_table "user_reviews", force: :cascade do |t|
    t.text     "description"
    t.integer  "salary_in_cents"
    t.boolean  "anonymous",                default: true, null: false
    t.integer  "job_id",                                  null: false
    t.integer  "user_id",                                 null: false
    t.datetime "deleted_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.float    "overall_rating",                          null: false
    t.integer  "pay_period"
    t.string   "currency"
    t.float    "mentorship_rating",                       null: false
    t.float    "work_life_balance_rating",                null: false
    t.float    "meaningful_work_rating",                  null: false
    t.integer  "company_id",                              null: false
    t.string   "token",                                   null: false
    t.integer  "user_review_spam_id"
  end

  add_index "user_reviews", ["company_id"], name: "index_user_reviews_on_company_id", using: :btree
  add_index "user_reviews", ["job_id"], name: "index_user_reviews_on_job_id", using: :btree
  add_index "user_reviews", ["token"], name: "index_user_reviews_on_token", unique: true, using: :btree
  add_index "user_reviews", ["user_id"], name: "index_user_reviews_on_user_id", using: :btree
  add_index "user_reviews", ["user_review_spam_id"], name: "index_user_reviews_on_user_review_spam_id", using: :btree

  create_table "user_to_review_votes", force: :cascade do |t|
    t.integer "user_id",        null: false
    t.integer "user_review_id", null: false
    t.boolean "vote",           null: false
  end

  add_index "user_to_review_votes", ["user_id", "user_review_id"], name: "index_user_to_review_votes_on_user_id_and_user_review_id", unique: true, using: :btree
  add_index "user_to_review_votes", ["user_id"], name: "index_user_to_review_votes_on_user_id", using: :btree
  add_index "user_to_review_votes", ["user_review_id"], name: "index_user_to_review_votes_on_user_review_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.datetime "deleted_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "email",                  default: "",    null: false
    t.string   "encrypted_password",     default: "",    null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet     "current_sign_in_ip"
    t.inet     "last_sign_in_ip"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.string   "first_name",             default: "",    null: false
    t.string   "last_name",              default: "",    null: false
    t.string   "provider"
    t.string   "uid"
    t.string   "token"
    t.boolean  "admin",                  default: false, null: false
    t.string   "image_url"
  end

  add_index "users", ["admin"], name: "index_users_on_admin", using: :btree
  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  add_index "users", ["token"], name: "index_users_on_token", using: :btree

  add_foreign_key "company_to_company_categories", "companies"
  add_foreign_key "company_to_company_categories", "company_categories"
  add_foreign_key "critiques", "users"
  add_foreign_key "interview_questions", "jobs"
  add_foreign_key "jobs", "companies"
  add_foreign_key "question_to_tags", "interview_question_tags"
  add_foreign_key "question_to_tags", "interview_questions"
  add_foreign_key "user_preferences", "users"
  add_foreign_key "user_profiles", "users"
  add_foreign_key "user_review_to_perk_tags", "perk_tags"
  add_foreign_key "user_review_to_perk_tags", "user_reviews"
  add_foreign_key "user_reviews", "companies"
  add_foreign_key "user_reviews", "jobs"
  add_foreign_key "user_reviews", "user_review_spams"
  add_foreign_key "user_reviews", "users"
end
