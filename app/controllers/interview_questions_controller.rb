class InterviewQuestionsController < ApplicationController
  def index
    difficulty = 'all';
    if InterviewQuestion::DIFFICULTIES.include? params[:difficulty]
      difficulty = params[:difficulty]
    end
    category = 'all'
    tag = InterviewQuestionTag.find_by_url_slug(params[:category])
    if not tag.nil?
      category = params[:category]
    end

    interview_questions = []
    if not tag.nil?
      interview_questions = tag.questions.select([:id, :title, :difficulty])
    else
      interview_questions = InterviewQuestion.select([:id, :title, :difficulty])
    end

    if difficulty != 'all'
      interview_questions = interview_questions.where(difficulty: difficulty)
    end

    respond_to do |format|
      format.html do
        @props = {
          interview_question: {
            interview_questions: interview_questions.as_json(include: :tags),
            difficulties: ['all'] + InterviewQuestion::DIFFICULTIES,
            categories: [{ name: 'all', url_slug: 'all' }] + InterviewQuestionTag.select([:name, :url_slug]).to_a,
            listFilter: { difficulty: difficulty, category: category }
          }
        }
      end
      format.json do
         render json: interview_questions.as_json(include: :tags)
      end
    end
  end

  def show
    interview_question = InterviewQuestion.select([:id, :title, :description_markdown, :difficulty])
                          .find(params[:id])
                          .as_json(include: :tags)

    respond_to do |format|
      format.html {
        @props = {
          interview_question: {
            interview_question: interview_question
          }
        }
      }
      format.json { 
        render json: interview_question
      }
    end
  end

  def get_filters
    respond_to do |format|
      format.json {
        render json: {
          difficulties: ['all'] + InterviewQuestion::DIFFICULTIES,
          categories: [{ name: 'all', url_slug: 'all' }] + InterviewQuestionTag.select([:name, :url_slug]).to_a
        }
      }
    end
  end
end
