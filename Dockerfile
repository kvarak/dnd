# Use Jekyll base image (auto-detects platform for Mac/Linux/Windows compatibility)
FROM jekyll/jekyll:4.2.2

# Set working directory
WORKDIR /srv/jekyll

# Install Node.js and npm for data extraction tools
RUN apk add --no-cache nodejs npm

# Expose port 4000
EXPOSE 4000

# Use bundle exec to avoid gem conflicts
# Gems will be installed on first run from the mounted Gemfile
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "4000", "--baseurl", "/dnd", "--watch"]
