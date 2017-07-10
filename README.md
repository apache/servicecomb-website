# ServiceComb.github.io
The Web Site of ServiceComb which is based on [Minimal Mistakes Jekyll Theme](https://mmistakes.github.io/minimal-mistakes/).  

# How to run the site locally
*  Install [Ruby](https://www.ruby-lang.org/en/downloads/) and [Gem](https://rubygems.org/) 

*  Install Jekyll and Bundler

   `gem install jekyll bundler`

*  Clone the site files

   `git clone git@github.com:ServiceComb/ServiceComb.github.io.git`

* cd ServiceComb.github.io.git

*  Install the gems with bundle

   `bundle install`

*  Start the jekyll server

   `bundle exec jekyll server`

*  Start web browser to access `http://localhost:4000`   

# Multiple language support
The website supports English now and English is used as the default language. 

Things to be **cautious**:

There are two language labels: *en* and *cn*.

1. When you write a post, add the following front matters under the title(if you write an Chinese post):
   ```yml
   lang: cn
   ref: unique_post_ref_just_like_the_url
   ```
   And remember to add the prefix **/cn** to your permalink, e.g. 
   before: 
   ```yml
   permalink: /about/me/
   ```
   after:    
   ```yml
   permalink: /cn/about/me/
   ```
   Besides, if contents of your post contains links to the Chinese version of pages, remember to add the 
   prefix **/cn** before the link. e.g. */about/community/* becomes */cn/about/community/*
   *Notes*: English Posts do not need to add any prefixes as it's the default language.
2. When you add items in *_data/navigation.yml* file, remember to add both English and Chinese version of that links.
3. If you want to provide both English and Chinese versions of your *bio* in your blogs, add *biocn* property in *_data/authors.yml*.
4. Posts of Chinese Language please put under the *cn* folder. It is just a good convention and won't affect what your posts suppose to be whether or not you obey this rule.
