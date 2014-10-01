require 'compass/import-once/activate'

# Section: Default Properties
project_type = :stand_alone
relative_assets = true
disable_warnings = false
preferred_syntax = :sass

# Section: Http Paths
http_path = '/'
http_javascripts_path = http_path + 'dev/js'
http_stylesheets_path = http_path + 'dev/css'
http_fonts_path = http_path + 'dev/fonts'
http_images_path = http_path + 'dev/images'
http_generated_images_path = "#{http_images_path}"


# Section: Compass Directories
javascripts_dir = 'dev/js'
css_dir = 'dev/css'
images_dir = 'dev/images'
generated_images_dir = "#{images_dir}"
fonts_dir = 'dev/fonts'
sass_dir = 'sass'

# Section: Compass Paths
project_real_path = File.realpath(File.join(File.dirname(__FILE__)))
project_path = "#{project_real_path}/"

javascripts_path = project_path + javascripts_dir
fonts_path = project_path + fonts_dir
css_path = project_path + css_dir
sass_path = project_path + sass_dir
images_path = project_path + images_dir
generated_images_path =  project_path + generated_images_dir
sprite_load_path = images_path
line_comments = true
