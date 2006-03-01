class FileSystemItem
    
    def initialize(path, root)
        @path = path
        @root = File.expand_path(root)
        if File.expand_path(File.join(@root, @path))[0,@root.length] != @root
            raise ArgumentError, "Invalid path", caller
        end
    end
    
    def name
        File.basename(File.expand_path(File.join(@root, @path)))
    end
    
    def id
        @path
    end
    
    def parent
        if File.expand_path(File.dirname(File.join(@root, @path)))[0,@root.length] != @root
            nil
        else
            FileSystemItem.new(File.dirname(@path), @root)
        end
    end
    
    def children
        result = []
        if self.directory?
            Dir.foreach(File.join(@root, @path)) do |x|
                if x[0,1] != '.'
                    result.push(FileSystemItem.new(File.join(@path, x), @root))
                end
            end
        end
        result
    end
    
    def directory?
        File.directory? File.join(@root, @path)
    end
    
end

