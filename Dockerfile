# Use Jekyll base image with ARM64 support
FROM --platform=linux/arm64 jekyll/jekyll:4.2.2

# Set working directory
WORKDIR /srv/jekyll

# Install Node.js and npm for data extraction tools
RUN apk add --no-cache nodejs npm

# Copy package.json for npm dependencies
COPY package.json ./

# Install npm dependencies (glob, js-yaml for validation tools)
RUN npm install

# Copy Gemfile first for dependency management
COPY Gemfile* ./

# Install bundler and dependencies
RUN bundle install

# Copy rest of site content
COPY . .

# Expose port 4000
EXPOSE 4000

# Use bundle exec to avoid gem conflicts
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "4000", "--baseurl", "/dnd", "--watch"]
