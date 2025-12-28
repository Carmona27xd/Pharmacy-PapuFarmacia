# Paths explanation

## Paths created

    /etc/nginx/
    /etc/nginx/api_conf.d/services
    /var/log/nginx

## Files distribution

    /etc/nginx/
    |---nginx.conf
    |---api_gateway.conf
    |---api_json_errors.conf
    |---api_keys.conf
    |---/api_conf.d/
    |   |---/services/
    |       |---auth_api.conf
    |       |---product_api.conf
    |       |---user_api.conf
    /var/log/nginx
    |---nginx_access.log
    |---auth_api.log
    |---user_api.log
    |---product_api_get.log
    |---product_api_write.log
