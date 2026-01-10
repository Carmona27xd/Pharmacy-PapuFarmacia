FROM nginx:latest

# Create the directory
RUN mkdir -p /etc/nginx/api_conf.d/services /var/log/nginx

# Main Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# API Gateway configuration
COPY api_gateway.conf /etc/nginx/api_gateway.conf
COPY api_json_errors.conf /etc/nginx/api_json_errors.conf
COPY api_keys.conf /etc/nginx/api_keys.conf

# Service-specific configurations
COPY ./services/admin_api.conf /etc/nginx/api_conf.d/services/admin_api.conf
COPY ./services/auth_api.conf /etc/nginx/api_conf.d/services/auth_api.conf
COPY ./services/product_api.conf /etc/nginx/api_conf.d/services/product_api.conf
COPY ./services/user_api.conf /etc/nginx/api_conf.d/services/user_api.conf
COPY ./services/sales_api.conf /etc/nginx/api_conf.d/services/sales_api.conf

EXPOSE 8080

# Nginx startup command
CMD ["nginx", "-g", "daemon off;"]