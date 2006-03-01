class NonModelDataController < ApplicationController
    
    # This is very similar to CustomDataController, which uses a custom data action for the same purpose.

    DATA = ["Root",
                ["Child 1", 
                    ["Child 1.1", ["Child 1.1.1"], ["Child 1.1.2"], ["Child 1.1.3"]], 
                    ["Child 1.2", ["Child 1.2.1"], ["Child 1.2.2"], ["Child 1.2.3"]]],
                ["Child 2", 
                    ["Child 2.1", ["Child 2.1.1"], ["Child 2.1.2"], ["Child 2.1.3"]], 
                    ["Child 2.2", ["Child 2.2.1"], ["Child 2.2.2"], ["Child 2.2.3"]]]]
    
    # Note: You should also provide a get_item_parent_proc in order for searching
    # to work, but for the purposes of this example it is not needed.
        
    live_tree :tree, 
              :find_item_proc => Proc.new { |x| _find(DATA, x) }, 
              :get_item_id_proc => Proc.new { |x| x[0] },
              :get_item_name_proc => Proc.new { |x| x[0] },
              :get_item_children_proc => Proc.new { |x| x[1..x.length] }

    def index
        @root = DATA;
    end
    
protected
    
    def NonModelDataController._find(root, id)
        if root[0] == id
            return root
        else
            for item in root[1..root.length]
                found = _find(item, id);
                if found
                    return found
                end
            end
            return nil;
        end
    end    
    
end
