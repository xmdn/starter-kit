FROM mysql/mysql-server:8.0

# Copy our custom database initialization script
COPY docker/mysql/create-testing-database.sh /docker-entrypoint-initdb.d/create-testing-database.sh

# Ensure it has the correct permissions
RUN chmod +x /docker-entrypoint-initdb.d/create-testing-database.sh
