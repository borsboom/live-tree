class FileSystemController < ApplicationController

    TEXT_EXTENSIONS = [".rb", ".js", ".css", ".html", ".rhtml", ".sql", ".txt", ""];
    IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".gif", ".png"];

    live_tree :fstree,
              :find_item_proc => Proc.new { |x| FileSystemItem.new(x, RAILS_ROOT) },
              :render_item_name => { :partial => "item_name" },
              :render_item_icon => { :partial => "item_icon" }
              
    def index
        if params['initial_file']
            @initial_file = params['initial_file']
            @initial_file_contents = _get_file_contents(@initial_file)
        end
        @fsroot = FileSystemItem.new("/", RAILS_ROOT)
    end

    def file_contents
        data = nil
        image_path = nil
        error = nil
        if IMAGE_EXTENSIONS.include?(File.extname(params['path']))
            begin
                _check_path(params['path'])
                image_path = params['path'];
            rescue
                error = $!.to_s            
            end
        else
            begin
                data = _get_file_contents(params['path']);
            rescue
                error = $!.to_s
            end        
        end
        render :partial => 'file_contents', :locals => { :path => params['path'], :file_contents => data, :image_path => image_path, :error => error }
    end

    def raw_file_contents
        send_file(_check_path(params['path']));        
    end
    
protected
    
    def _check_path(path)
        @full_path = File.expand_path(File.join(RAILS_ROOT, path))
        root = File.expand_path(RAILS_ROOT)
        if @full_path[0,root.length] != root
            raise "Invalid path."
        elsif !TEXT_EXTENSIONS.include?(File.extname(@full_path)) && !IMAGE_EXTENSIONS.include?(File.extname(@full_path))
            raise "You may not view files of this type."
        elsif File.size(@full_path) > 256 * 1024
            raise "You may not view files this large."
        else
            return @full_path            
        end
    end

    def _get_file_contents(path)
        File.read(_check_path(path))
    end    

end
