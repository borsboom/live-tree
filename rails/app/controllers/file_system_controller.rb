class FileSystemController < ApplicationController
    
    class FSItem
        def initialize(path, root)
            @path = path
            @root = File.expand_path(root)
            if File.expand_path(File.join(@root, @path))[0,@root.length] != @root
                raise ArgumentError, "Invalid path", caller
            end
        end
        def name
            CGI::escapeHTML(File.basename(File.expand_path(File.join(@root, @path))))
        end
        def id
            @path
        end
        def parent
            if File.expand_path(File.dirname(File.join(@root, @path)))[0,@root.length] != @root
                nil
            else
                FSItem.new(File.dirname(@path), @root)
            end
        end
        def children
            result = []
            if File.directory? File.join(@root, @path)
                Dir.foreach(File.join(@root, @path)) do |x|
                    if x[0,1] != '.'
                        result.push(FSItem.new(File.join(@path, x), @root))
                    end
                end
            end
            result
        end
    end

    live_tree :fstree,
              :find_item_proc => Proc.new { |x| FSItem.new(x, RAILS_ROOT) }

    def index
        @fsroot = FSItem.new("/", RAILS_ROOT)
    end

end
