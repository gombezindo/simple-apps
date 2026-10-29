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
                withCredentials ([
                    string(credentialsId: 'db-name', variable: 'DB_NAME'),
                    string(credentialsId: 'db-user', variable: 'DB_USER'),
                    string(credentialsId: 'db-password', variable: 'DB_PASSWORD'),
                    string(credentialsId: 'db-host', variable: 'DB_HOST'),
                    string(credentialsId: 'app-port', variable: 'APP_PORT')
                ]) {
                    script {
                        // Membuat file .env di dalam folder apps agar terbaca oleh aplikasi & docker
                        writeFile file: 'apps/.env', text: """
                        DB_NAME=${DB_NAME} 
                        DB_HOST=${DB_HOST} 
                        DB_USER=${DB_USER} 
                        DB_PASS=${DB_PASSWORD} 
                        APP_PORT=${APP_PORT} 
                        """.stripIndent()
                    }
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
                withCredentials ([
                    string(credentialsId: 'db-name', variable: 'DB_NAME'),
                    string(credentialsId: 'db-user', variable: 'DB_USER'),
                    string(credentialsId: 'db-password', variable: 'DB_PASSWORD'),
                    string(credentialsId: 'db-host-container', variable: 'DB_HOST'),
                    string(credentialsId: 'app-port', variable: 'APP_PORT')
                ]) {
                    script {
                        // Timpa file .env khusus untuk container jika host-nya berbeda
                        writeFile file: 'apps/.env', text: """
                        DB_NAME=${DB_NAME} 
                        DB_HOST=${DB_HOST} 
                        DB_USER=${DB_USER} 
                        DB_PASS=${DB_PASSWORD} 
                        APP_PORT=${APP_PORT} 
                        """.stripIndent()
                    }
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
