# Use Jekyll base image with ARM64 support
FROM --platform=linux/arm64 jekyll/jekyll:4.2.2

# Set working directory
WORKDIR /srv/jekyll

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
