class ApiController < ActionController::API
    def create
        user = User.new(username: params[:username], password: params[:password])
        if user.save
            render json: { message: 'Account created successfully', user: user }, status: :created
        else
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def index
        users = User.all
        render json: users
    end
end