# ServiceComb.github.io
The Web Site of ServiceComb which is based on [Minimal Mistakes Jekyll Theme](https://mmistakes.github.io/minimal-mistakes/).  

# How to run the site locally
*  Install Ruby and Gem 

*  Install Jekyll and Bundler

   `gem install jekyll bundler`

*  Clone the site files

   `git clone git@github.com:ServiceComb/ServiceComb.github.io.git`

* cd ServiceComb.github.io.git

*  Install the gems with bundle 

   `bundle install`

*  Start the jekyll server 

   `bundle exec jekyll server`

# How to publish the site
 1. Checkout branch hg-pages and merge the changes from master
 2. Generate the _site files `bundle exec jekyll build`
 3. Checked in the changes
 4. Push the hg-pages to github
