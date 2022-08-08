# ServiceComb Website
The Web Site of ServiceComb is based on [Minimal Mistakes Jekyll Theme](https://mmistakes.github.io/minimal-mistakes/).

# NOTE for PR
As this website is using the [gitpubsub](https://www.apache.org/dev/project-site.html) and we use Jekyll to generate the site.
We choose master branch to hold all the site source change and asf-site for apache gitpubsub.
Please sent your PR to the master branch instead of asf-site.

# How to run the site locally   
*  Change to non-root user  

*  Install [Ruby](https://www.ruby-lang.org/en/downloads/) and [Gem](https://rubygems.org/)   

*  Install Jekyll and Bundler   

   `sudo gem install jekyll bundler`  

*  Clone the site files

   `git clone https://github.com/apache/incubator-servicecomb-website.git`

* cd incubator-servicecomb-website

*  Install the gems with bundle

   `sudo bundle install`

*  Start the jekyll server

   `sudo bundle exec jekyll server`

*  Start web browser to access `http://localhost:4000` 

*  Build the website `sudo bundle exec jekyll build`

# How to push the change to apache website

[Follow This Script](script/release)

**Note that tested versions of the tools covered in this section are as following,**    

*  Ruby 2.3  
*  Gem 2.7.6   
*  Bundler 2.3   

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

# Add caption to image
Add the annotation `{: .figure-caption}` below the *Image Caption* line as follows:
```markdown
![image alt text](image_path)
Image Caption
{: .figure-caption}
```
