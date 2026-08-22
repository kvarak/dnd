# jekyll/jekyll:4.2.2 only ships linux/amd64. ARG lets the builder pass a
# different value without triggering the DL3029 constant-platform lint rule.
# On Apple Silicon and Windows, Docker uses Rosetta/emulation automatically.
ARG JEKYLL_PLATFORM=linux/amd64
FROM --platform=${JEKYLL_PLATFORM} jekyll/jekyll:4.2.2

# Set working directory
WORKDIR /srv/jekyll

# Install Node.js and npm for data extraction tools
RUN apk add --no-cache nodejs npm

# Expose port 4000
EXPOSE 4000

# Use bundle exec to avoid gem conflicts
# Gems will be installed on first run from the mounted Gemfile
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "4000", "--baseurl", "/dnd", "--watch"]
