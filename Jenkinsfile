pipeline {
    agent { label 'devops1-dedykw' }

    stages {
        stage('Pull Code') {
            steps {
                git branch: 'main', url: 'https://github.com/gombezindo/simple-apps.git'
            }
        }
        
        stage('Build') {
            steps {
                sh '''
                cd apps
                npm install
                '''
            }
        }

        stage('Set ENV') {
            steps {
                withCredentials([
                    string(credentialsId: 'db_name', variable: 'db_name'),
                    string(credentialsId: 'db_host', variable: 'db_host'),
                    string(credentialsId: 'db_user', variable: 'db_user'),
                    string(credentialsId: 'db_pass', variable: 'db_pass'),
                    string(credentialsId: 'app_port', variable: 'app_port')
                ]) {
                    sh '''
                    cat <<EOF > apps/.env
DB_NAME=${db_name}
DB_HOST=${db_host}
DB_USER=${db_user}
DB_PASS=${db_pass}
APP_PORT=${app_port}
EOF
                    cp apps/.env .env
                    '''
                }
            }
        }

        stage('Testing') {
            steps {
                sh '''
                cd apps
                npm test
                npm run test:coverage
                '''
            }
        }
        
        stage('Code Review') {
            steps {
                sh '''
                cd apps
                sonar-scanner \
                    -Dsonar.projectKey=simple-apps \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=http://172.23.13.81:9000 \
                    -Dsonar.login=sqp_f45b49655ac23390e4a71d0c3974a15a6df74b7f
                '''
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                docker compose up --build -d
                '''
            }
        }
        
        stage('Backup') {
            steps {
                sh 'docker compose push' 
            }
        }
    }
}
