// LiveTree, version: 0.1.2
//
// Home page: http://www.epiphyte.ca/code/live_tree.html
//
// Copyright (c) 2005-2006 Emanuel Borsboom
// 
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the 
// "Software"), to deal in the Software without restriction, including 
// without limitation the rights to use, copy, modify, merge, publish, 
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the 
// following conditions:
// 
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function LiveTree(id, options) {
    this.id = id;
    
    if (options == null) {
        options = {};
    }
    
    this.dataUrl = options.dataUrl;
    this.cssClass = options.cssClass;
    this.cssStyle = options.cssStyle;
    this.expandRootItem = (options.expandRootItem == null ? true : options.expandRootItem);	
    this.hideRootItem = (options.hideRootItem == null ? false : options.hideRootItem);
    this.rootItemId = options.rootItemId;
    this.expandItemOnClick = (options.expandItemOnClick == null ? true : options.expandItemOnClick);
    this.initialData = options.initialData;
    this.scroll = (options.scroll == null ? true : options.scroll);
    this.preloadItems = (options.preloadItems == null ? true : options.preloadItems);
    
    this.collapsedItemIconHtml = options.collapsedItemIconHtml;
    this.expandedItemIconHtml = options.expandedItemIconHtml;
    this.leafIconHtml = options.leafIconHtml;
    this.loadingIconHtml = options.loadingIconHtml;
    this.notLoadedIconHtml = options.notLoadedIconHtml;
    this.loadingTreeHtml = options.loadingTreeHtml;
    this.searchingHtml = options.searchingHtml;
    this.loadingItemHtml = options.loadingItemHtml;
    this.notLoadedItemHtml = options.notLoadedItemHtml;

    this.onClickItem = options.onClickItem;
	this.onContextMenu = options.onContextMenu;    
    this.allowClickBranch = (options.allowClickBranch == null ? true : options.allowClickBranch);
    this.allowClickLeaf = (options.allowClickLeaf == null ? true : options.allowClickLeaf);
    this.onExpandItem = options.onExpandItem;
    this.onCollapseItem = options.onCollapseItem;
    this.onLoadItem = options.onLoadItem;
    
    this._root = {};
    this._itemsIndex = {};
    this._expandedItems = {};
    this._activeItemId = null;
    this._scrollToItemIdOnLoad = null;
    this._scrollToItemMustBeExpanded = false;
    this._searchCount = 0;
    this._autoloadCount = 0;
    this._updateItemDisplay = null;
}

//LiveTree.DEV_SHOW_PRELOADS = true;
//LiveTree.DEV_SHOW_ITEM_IDS = true;

LiveTree.prototype._markItemForUpdateDisplay = function (item) {
    var tree = this;
    // This is not very intelligent yet... basically if only one item needs to be updated, that's fine, otherwise the whole tree is updated.
    if (tree._updateItemDisplay == null) {
        tree._updateItemDisplay = item;
    } else if (tree._updateItemDisplay != item) {
        tree._updateItemDisplay = tree._root;
    }	
}

LiveTree.prototype._getClass = function (suffix) {
    if (suffix != "") {
        suffix = "_" + suffix;
    }
    result = 'live_tree' + suffix;
    if (this.cssClass != null) {
        result += ' ' + this.cssClass + suffix;
    }
    return result;
}

LiveTree.prototype._escapeId = function (itemId) {
    return escape(itemId);
}

LiveTree.prototype._getCollapsedItemIconHtml = function (item) {
    if (this.collapsedItemIconHtml != null) {
        return this.collapsedItemIconHtml;
    } else {
        return '<img src="/images/live_tree_transparent_pixel.gif" alt="&gt;" id="' + this.id + '_item_branching_icon_' + this._escapeId(item.id) + '" class="' + this._getClass("item_branching_icon") + ' ' + this._getClass("branch_collapsed_icon") + '" />';
    }
}

LiveTree.prototype._getExpandedItemIconHtml = function (item) {
    if (this.expandedItemIconHtml != null) {
        return this.expandedItemIconHtml;
    } else {
        return '<img src="/images/live_tree_transparent_pixel.gif" alt="v" id="' + this.id + '_item_branching_icon_' + this._escapeId(item.id) + '" class="' + this._getClass("item_branching_icon") + ' ' + this._getClass("branch_expanded_icon") + '" />';
    }
}

LiveTree.prototype._getLeafIconHtml = function (item) {
    if (this.leafIconHtml != null) {
        return this.leafIconHtml;
    } else {
        return '<img src="/images/live_tree_transparent_pixel.gif" alt=" " id="' + this.id + '_item_branching_icon_' + this._escapeId(item.id) + '" class="' + this._getClass("item_branching_icon") + ' ' + this._getClass("leaf_icon") + '" />';
    }
}

LiveTree.prototype._getLoadingIconHtml = function () {
    if (this.loadingIconHtml != null) {
        return this.loadingIconHtml;
    } else {
        return '<img src="/images/live_tree_transparent_pixel.gif" alt="[loading]" class="' + this._getClass("loading_icon") + '" />';
    }
}

LiveTree.prototype._getNotLoadedIconHtml = function () {
    if (this.notLoadedIconHtml != null) {
        return this.notLoadedIconHtml;
    } else {
        return '<img src="/images/live_tree_transparent_pixel.gif" alt="[not loaded]" class="' + this._getClass("not_loaded_icon") + '" />';
    }
}

LiveTree.prototype._getLoadingTreeHtml = function () {
    if (this.loadingTreeHtml != null) {
        return this.loadingTreeHtml;
    } else {
        return '<span class="' + this._getClass("loading_tree") + '">' + this._getLoadingIconHtml() + 'Loading tree data&hellip;</span>';
    }
}

LiveTree.prototype._getSearchingHtml = function () {
    if (this.searchingHtml != null) {
        return this.searchingHtml;
    } else {
        return '<div class="' + this._getClass("searching") + '">' + this._getLoadingIconHtml() + 'Searching for item&hellip;</div>';
    }
}

LiveTree.prototype._getLoadingItemHtml = function () {
    if (this.loadingItemHtml != null) {
        return this.loadingItemHtml;
    } else {
        return this._getLoadingIconHtml() + 'Loading&hellip;';
    }
}

LiveTree.prototype._getNotLoadedItemHtml = function () {
    if (this.notLoadedItemHtml != null) {
        return this.notLoadedItemHtml;
    } else {
        return this._getNotLoadedIconHtml() + '(not loaded)';
    }
}

LiveTree.prototype._isLeaf = function (item) {
    return item.children != null && item.children.length == 0;
}

LiveTree.prototype.isLeaf = function (itemId) {
    var tree = this;
    return tree._isLeaf(tree._getItem(itemId));
}

LiveTree.prototype._isLoaded = function (item) {
    return item.children != null;
}

LiveTree.prototype.isLoaded = function (itemId) {
    var tree = this;
    return tree._isLoaded(tree._getItem(itemId));
}

LiveTree.prototype._isExpanded = function (item) {
    var tree = this;
    if (item == tree._root) {
        return true;
    } else {
        return tree.isExpanded(item.id);
    }
}

LiveTree.prototype.isExpanded = function (itemId) {
    var tree = this;
    return tree._expandedItems[itemId] != null;
}

LiveTree.prototype._isLoadingBackground = function (item) {
    var tree = this;
    return item.isLoading && !tree._isExpanded(item);
}

LiveTree.prototype._startAutoloads = function (item) {
    var tree = this;
    if (tree._autoloadCount > 0) {
        return false;
    }
    if (item == null) {
        item = tree._root;
    }
    //alert("XXX startAutoloads " + item.id);
    if (!tree._isExpanded(item) || item.isLoading) {
        return false;
    }    
    if (!tree._isLoaded(item))
    {
        tree._autoloadCount++;
        item.isLoading = true;
        tree._requestItem(item.id, 2, tree._onAutoExpandItemReceived.bind(tree))
        tree._markItemForUpdateDisplay(item);        
        return true;
    }
    var tailBranch = true;
    for (var i = 0; i < item.children.length; i++) {
        var child = item.children[i];
        if (!tree._isLeaf(child) && (tree._isLoaded(child) || child.isLoading)) {
            tailBranch = false;
        }
    }
    var doLoad = false;
    var childExpanded = false;
    if (tailBranch) {
        for (var i = 0; i < item.children.length; i++) {
            var child = item.children[i];
            if (!tree._isLeaf(child)) {
                if (!tree._isLoaded(child) && !child.isLoading && tree.preloadItems) {
                    //alert("XXX setting loading for " + child.id);
                    doLoad = true;
                    if (tree._isExpanded(child)) {
                        childExpanded = true;                        
                    }
                    child.isLoading = true;
                }
            }
        }
    }
    var didLoad = false;
    if (doLoad) {
        //alert("XXX preloading children of " + item.id);
        tree._autoloadCount++;
        if (item == tree._root) {
            tree._requestItem(tree._root.children[0].id, 2, tree._onPreloadItemReceived.bind(tree));	
        } else {
            tree._requestItem(item.id, 3, tree._onPreloadItemReceived.bind(tree));	
        }
        if (childExpanded || LiveTree.DEV_SHOW_PRELOADS) {
            tree._markItemForUpdateDisplay(item);
        }
        didLoad = true;
    } else {
        for (var i = 0; i < item.children.length; i++) {
            var child = item.children[i];
            if (!tree._isLeaf(child)) {
                if (tree._startAutoloads(child)) {
                    didLoad = true;
                }
            }
        }
    }

    return didLoad;
}

LiveTree.prototype._stopLoading = function () {
    var tree = this;
    function recurse(item) {
        if (item.isLoading) {
            item.isLoading = false;
            tree._expandedItems[item.id] = null;
        }		
        if (item.children != null) {
            for (var i = 0; i < item.children.length; i++) {
                recurse(item.children[i]);
            }
        }
    }
    recurse(tree._root);
    tree._markItemForUpdateDisplay(tree._root);
    tree._searchCount = 0;
    tree._autoloadCount = 0;
    tree._updateDisplay();
}

LiveTree.prototype._onItemFailure = function (request) {
    alert("LiveTree error: could not get data from server: HTTP error: " + request.status);
    //alert("XXX " + request.responseText);
    this._stopLoading();
}

LiveTree.prototype._ajaxRequestItem = function(requestOptions, onItemCallback) {
    var tree = this;
    var url = tree.dataUrl;
    var delim = "?";
    if (requestOptions.itemId != null) {
        url += delim + "item_id=" + escape(requestOptions.itemId);
        delim = "&";
    }
    if (requestOptions.depth != null) {
        url += delim + "depth=" + requestOptions.depth;
        delim = "&";
    }
    if (requestOptions.includeParents) {
        url += delim + "include_parents=1";
        delim = "&";
    }
    if (requestOptions.rootItemId != null) {
        url += delim + "root_item_id=" + escape(requestOptions.rootItemId);
        delim = "&";        
    }
    new Ajax.Request(url, {onSuccess: function (request) { tree._onItemResponse(request, onItemCallback, requestOptions) }, onFailure: tree._onItemFailure.bind(tree), evalScripts:true, asynchronous:true, method:"get"});
    return true;    
}

LiveTree.prototype._requestItem = function (itemId, depth, onItemCallback, options) {
    var tree = this;
    if (options == null) {
        options = {};
    }
    var requestOptions = {};
    if (itemId != null) {
        requestOptions.itemId = itemId;
    }
    if (depth != null) {
        requestOptions.depth = depth;
    }
    if (options.includeParents) {
        requestOptions.includeParents = true;
        requestOptions.rootItemId = tree.rootItemId;
        tree._searchCount++;        
    }
    if (options.initialRequest) {
        requestOptions.initialRequest = true;
    }
    return tree._ajaxRequestItem(requestOptions, onItemCallback);
}

LiveTree.prototype._onExpandItemReceived = function (item, requestOptions) {
    var tree = this;
    //alert("XXX _onExpandItemReceived item.id=" + item.id);
    item.isLoading = false;
    tree._markItemForUpdateDisplay(item);
    tree._startAutoloads();
    tree._updateDisplay();	
}



LiveTree.prototype._onAutoExpandItemReceived = function (item, requestOptions) {
    var tree = this;
    if (tree._autoloadCount <= 0) {
        return;
    }
    tree._autoloadCount--;
    tree._onExpandItemReceived(item, requestOptions);    
}

LiveTree.prototype._onPreloadItemReceived = function (item, requestOptions) {
    var tree = this;
    if (tree._autoloadCount <= 0) {
        return;
    }
    //alert("XXX got preload item");
    tree._autoloadCount--;
    item.isLoading = false;
    for (var i = 0; i < item.children.length; i++) {
        item.children[i].isLoading = false;
    }
    tree._startAutoloads();
    tree._markItemForUpdateDisplay(item);
    tree._updateDisplay();	
}

LiveTree.prototype._onClickExpand = function (item) {
    var tree = this;
    var expanded = tree._expandItem(item);
    tree._updateDisplay();	
    if (expanded) {
        tree.scrollToItem(item.id);
        if (item.isLoading) {
            tree._scrollToItemIdOnLoad = item.id;
            tree._scrollToItemMustBeExpanded = true;
        }
        if (tree.onExpandItem != null) {
            tree.onExpandItem(item);
        }
    }
}

LiveTree.prototype._onClickCollapse = function (item) {
    var tree = this;
    if (!tree._isExpanded(item)) {
        return;
    }
    tree._expandedItems[item.id] = null;
    tree._markItemForUpdateDisplay(item);
    tree._updateDisplay();	
    if (tree.onCollapseItem != null) {
        tree.onCollapseItem(item);
    }
}

LiveTree.prototype._onClickItem = function (item) {
    var tree = this;
    if (tree.expandItemOnClick && !tree._isExpanded(item) && !tree._isLeaf(item)) {
        tree._onClickExpand(item);		
    }
    if (tree.onClickItem != null && ((tree.allowClickLeaf && tree._isLeaf(item)) || (tree.allowClickBranch && !tree._isLeaf(item)))) {
        tree.onClickItem(item);
    }
    tree._updateDisplay();
}

LiveTree.prototype._getItem = function (itemId) {
    return this._itemsIndex[itemId];
}

LiveTree.prototype._getItemElementId = function (itemId) {
    return this.id + "_item_" + this._escapeId(itemId);
}

LiveTree.prototype._getItemElement = function (itemId) {
    return $(this._getItemElementId(itemId));
}

LiveTree.prototype._isRootItem = function (item) {
    var tree = this;
    return item == tree._root || (tree.hideRootItem && item == tree._root.children[0]);
}

LiveTree.prototype._renderItemHeading = function (item) {
    var tree = this;
    var html = '';
    if (!tree._isLeaf(item)) {
        html += '<a href="#" id="' + tree.id + '_item_branching_link_' + tree._escapeId(item.id) + '" class="' + this._getClass("item_branching_link") + '">';
        if (tree._isExpanded(item)) {
            html += tree._getExpandedItemIconHtml(item);
        } else {
            html += tree._getCollapsedItemIconHtml(item);
        }
        html += '</a>';
    } else {
        html += tree._getLeafIconHtml(item);
    }
    
    if (item.icon != null) {
        html += '<span id="' + tree.id + '_item_icon_' + tree._escapeId(item.id) + '" class="' + this._getClass("item_icon") + '">' + item.icon + '</span>';
    }
    
    var itemLinkExists = false;
    var extraNameClass = "";
    if (item.id == tree._activeItemId) {
        extraNameClass = " " + this._getClass("active_item_name");
    }    
    var name_html = '<span id="' + tree.id + '_item_name_' + tree._escapeId(item.id) + '" class="' + this._getClass("item_name") + extraNameClass + '">' + item.name + '</span>';
    if (((tree.onClickItem != null && ((tree.allowClickLeaf && tree._isLeaf(item)) || (tree.allowClickBranch && !tree._isLeaf(item)))) ||
            (tree.expandItemOnClick && !tree._isLeaf(item) && !tree._isExpanded(item))) && !item.isMessageDisplay) {
        name_html = '<a href="#" id="' + tree.id + '_item_link_' + tree._escapeId(item.id) + '" class="' + this._getClass("item_link") + '">' + name_html + '</a>';
        itemLinkExists = true;
    }
    if (LiveTree.DEV_SHOW_ITEM_IDS) {
        name_html = "(" + item.id + ") " + name_html;
    }
    html += name_html;
    if (LiveTree.DEV_SHOW_PRELOADS) {
        if (tree._isLoadingBackground(item)) {
            html += " " + tree._getLoadingIconHtml();
        }
    }
    $(tree.id + "_item_heading_" + tree._escapeId(item.id)).innerHTML = html;
    if (!tree._isLeaf(item)) {
        if (tree._isExpanded(item)) {
            $(tree.id + '_item_branching_link_' + tree._escapeId(item.id)).onclick = function () { tree._onClickCollapse(item); return false }		
        } else {
            $(tree.id + '_item_branching_link_' + tree._escapeId(item.id)).onclick = function () { tree._onClickExpand(item); return false }
        }
    }
    if (itemLinkExists) {
        $(tree.id + '_item_link_' + tree._escapeId(item.id)).onclick = function() { tree._onClickItem(item); return false }
    }    
    if (tree.onContextMenu != null) {
        $(tree.id + '_item_name_' + tree._escapeId(item.id)).oncontextmenu = function() { return tree.onContextMenu(item) }
    }
}

LiveTree.prototype._hideItem = function (child) {
    var tree = this;
    var elem = tree._getItemElement(child.id);
    if (elem) {
        $(tree.id).removeChild(elem);
        if (tree._isLoaded(child) || (child.isLoading && !tree._isLoadingBackground(child))) {
            tree._hideItemChildren(child);
        }
    }
}

LiveTree.prototype._hideItemChildren = function (item) {
    var tree = this;
    tree._hideItem(tree._getLoadingDisplayChild(item));
    tree._hideItem(tree._getNotLoadedDisplayChild(item));
    if (tree._isLoaded(item)) {
        for (var i = 0; i < item.children.length; i++) {
            tree._hideItem(item.children[i]);
        }
    }
}

LiveTree.prototype._updateItemChildren = function (item, afterElem, indentLevel, containerElem) {
    var tree = this;
    
    function doUpdateChild(child) {
        var elem = tree._getItemElement(child.id);
        if (elem == null) {
            var html = "";
            html += '<div id="' + tree.id + '_item_' + tree._escapeId(child.id) + '" class="' + tree._getClass("item") + '">';
            for (var j = 0; j < indentLevel; j++) {
                html += '<div class="' + tree._getClass("item_indent") + '">';
            }
            html += '<span id="' + tree.id + '_item_heading_' + tree._escapeId(child.id) + '" class="' + tree._getClass("item_heading") + '"></span>';
            for (var j = 0; j < indentLevel; j++) {
                html += '</div>';
            }
            html += '</div>';
            new Insertion.After(afterElem, html);
            elem = tree._getItemElement(child.id);
        }
        tree._renderItemHeading(child);
        afterElem = tree._updateItemChildren(child, elem, indentLevel + 1, containerElem);
    }
    
    if (!tree._isExpanded(item)) {
        tree._hideItemChildren(item);
    } else {
        if (tree._isLoaded(item)) {
            tree._hideItem(tree._getLoadingDisplayChild(item));
            tree._hideItem(tree._getNotLoadedDisplayChild(item));
            for (var i = 0; i < item.children.length; i++) {	
                doUpdateChild(item.children[i]);
            }        
        } else if (item.isLoading) {
            tree._hideItem(tree._getNotLoadedDisplayChild(item));
            doUpdateChild(tree._getLoadingDisplayChild(item));
        } else {
            tree._hideItem(tree._getLoadingDisplayChild(item));
            doUpdateChild(tree._getNotLoadedDisplayChild(item));            
        }        
    }
    
    return afterElem;
}

LiveTree.prototype._getLoadingDisplayChild = function (item) {
    var tree = this;
    return {id: "___LIVE_TREE_LOADING_" + item.id + "___", 
             name: tree._getLoadingItemHtml(), 
             children: [], 
             isMessageDisplay: true};
}

LiveTree.prototype._getNotLoadedDisplayChild = function (item) {
    var tree = this;
    return {id: "___LIVE_TREE_NOT_LOADED_" + item.id + "___", 
             name: tree._getNotLoadedItemHtml(), 
             children: [], 
             isMessageDisplay: true};
}

LiveTree.prototype._updateDisplay = function () {
    var tree = this;
    if (tree._searchCount > 0) {
        Element.show(tree.id + "_searching");
    } else {
        Element.hide(tree.id + "_searching");
    }
    var updateItem = tree._updateItemDisplay;	
    if (updateItem != null) {
        tree._updateItemDisplay = null;
        if (tree._isRootItem(updateItem)) {
            if (tree.hideRootItem) {
                updateItem = tree._root.children[0];
            }
            tree._updateItemChildren(updateItem, $(tree.id + "_root"), 0, $(tree.id));
        } else {
            tree._renderItemHeading(updateItem);
            
            var indentLevel = 0;
            var parentItem = updateItem;
            while (!tree._isRootItem(parentItem)) {
                indentLevel++;
                parentItem = parentItem.parent;
            }
            
            tree._updateItemChildren(updateItem, tree._getItemElement(updateItem.id), indentLevel, $(tree.id));
        }
    }
    tree._checkScrollOnLoad();
}

LiveTree.prototype._checkScrollOnLoad = function () {
    var tree = this;
    if (tree._scrollToItemIdOnLoad == null) {
        return;
    }
    var item = tree._itemsIndex[tree._scrollToItemIdOnLoad];
    if (item == null) {
        return;
    }
    if (tree._scrollToItemMustBeExpanded) {
        if (tree._isLoaded(item)) {
            // The user may have collapsed the item while it was loading, so only scroll to it if it's still expanded.
            if (tree._isExpanded(item)) {
                tree.scrollToItem(item.id);
            }
            tree._scrollToItemIdOnLoad = null;
        }
    } else {
        tree.scrollToItem(item.id);
        tree._scrollToItemIdOnLoad = null;		
    }
}

LiveTree.prototype._getElementPosition = function (destinationLink) {
    // borrowed from http://www.sitepoint.com/print/scroll-smoothly-javascript
    var destx = destinationLink.offsetLeft;  
    var desty = destinationLink.offsetTop;
    var thisNode = destinationLink;
    while (thisNode.offsetParent &&  
            (thisNode.offsetParent != document.body)) {
        thisNode = thisNode.offsetParent;
        destx += thisNode.offsetLeft;
        desty += thisNode.offsetTop;
    }
    return { x: destx, y: desty }
}

LiveTree.prototype._scrollTo = function (top) {
    var tree = this;
    if (!tree.scroll) {
        return;
    }
    var containerElem = $(tree.id);
    containerElem.scrollTop = top;
}

LiveTree.prototype.scrollToItem = function (itemId) {
    //alert("XXX scrolling to " + itemId);
    var tree = this;
    if (!tree.scroll) {
        return;
    }
    var itemElem = tree._getItemElement(itemId);
    if (itemElem == null) {
        return;
    }
    var containerElem = $(tree.id);
    var itemPos = tree._getElementPosition(itemElem);
    var containerPos = tree._getElementPosition(containerElem);
    var itemTop = itemPos.y - containerPos.y;
    var containerHeight = containerElem.offsetHeight - 35; //HACK: adjust for space used by scrollbars and other decoration
    if (itemTop + itemElem.offsetHeight > containerElem.scrollTop + containerHeight ||
            itemTop < containerElem.scrollTop) {
        // item is currently not entirely visible
        if (itemElem.offsetHeight > containerHeight) {
            // item is too big to fit, so scroll to the top
            tree._scrollTo(itemTop);
        } else {
            if (itemTop < containerElem.scrollTop + containerHeight) {
                // item is partially onscreen (the top is showing), so put whole item at bottom
                tree._scrollTo(itemTop + itemElem.offsetHeight - containerHeight);
            } else {
                // item is entirely offscreen, so center it
                tree._scrollTo(itemTop - containerHeight/2 + itemElem.offsetHeight/2);
            }
        }
    }
    tree._scrollToItemOnLoad = null;
}

LiveTree.prototype._expandItem = function (item) {
    var tree = this;
    
    // Make sure all item's parents are expanded as well
    var didExpand = false;
    var parent = item.parent;
    while (parent != tree._root && parent != null) {
        if (!tree._isExpanded(parent)) {
            tree._expandedItems[parent.id] = true;
            tree._markItemForUpdateDisplay(parent);
            didExpand = true;
        }
        parent = parent.parent;
    }	

    // Expand the selected item
    var needToLoad = false;
    if (!tree._isExpanded(item)) {
        needToLoad = (item.children == null && !item.isLoading);
        if (needToLoad) {
            item.isLoading = true;
        }
        tree._expandedItems[item.id] = true;
        tree._markItemForUpdateDisplay(item);
        didExpand = true;
    }
    
    // If the item has not loaded, load it now
    if (needToLoad) {
        tree._requestItem(item.id, 2, tree._onExpandItemReceived.bind(tree));	
    }	

    tree._startAutoloads();	
    return didExpand;
}

LiveTree.prototype._onExpandItemParentsReceived = function (item, requestOptions) {
    var tree = this;
    var requestedItem = tree._getItem(requestOptions.itemId);
    this._expandItem(requestedItem);
    tree._startAutoloads();
    tree._updateDisplay();	
}

LiveTree.prototype.expandItem = function (itemId) {
    var tree = this;
    var item = tree._getItem(itemId);
    var search = false;
    if (item == null) {
        tree._requestItem(itemId, 2, tree._onExpandItemParentsReceived.bind(tree), { includeParents: true });
        search = true;
    } else {
        this._expandItem(this._itemsIndex[itemId]);
    }
    tree._updateDisplay();
    if (search) {
        tree._scrollTo(0);
        tree._scrollToItemIdOnLoad = itemId;		
        tree._scrollToItemMustBeExpanded = false;
    } else {
        tree.scrollToItem(itemId);
    }
}

LiveTree.prototype._onExpandParentsOfItemReceived = function (item, requestOptions) {
    var tree = this;
    //alert("XXX _onExpandParentsOfItemReceived item.id=" + item.id);
    var requestedItem = tree._getItem(requestOptions.itemId);
    tree._expandItem(requestedItem.parent);
    tree._startAutoloads();
    tree._updateDisplay();	
}

LiveTree.prototype.expandParentsOfItem = function (itemId) {
    var tree = this;
    var item = tree._getItem(itemId);
    var search = false;
    if (item == null) {
        tree._requestItem(itemId, 1, tree._onExpandParentsOfItemReceived.bind(tree), { includeParents: true });
        search = true;
    } else {
        tree._expandItem(item.parent);
    }
    tree._updateDisplay();
    if (search) {
        tree._scrollTo(0);
        tree._scrollToItemIdOnLoad = itemId;		
        tree._scrollToItemMustBeExpanded = false;
    } else {
        tree.scrollToItem(itemId);
    }
}

LiveTree.prototype.activateItem = function (itemId) {
    var tree = this;
    // un-highlight the old active item
    var oldElem = $(tree.id + '_item_name_' + tree._escapeId(tree._activeItemId));
    if (oldElem != null) {
        oldElem.className = tree._getClass("item_name");
    }
    // highlight the new active item
    var elem = $(tree.id + '_item_name_' + tree._escapeId(itemId));
    if (elem != null) {
        elem.className = tree._getClass("item_name") + " " + tree._getClass("active_item_name");
    }
    tree._activeItemId = itemId;
    tree.scrollToItem(itemId);
}

LiveTree.prototype.getHtml = function() {
    var tree = this;	
    var html = '';
    html += '<div id="' + tree.id + '" class="' + tree._getClass("") + '"';
    if (tree.cssStyle != null) {
        html += ' style="' + tree.cssStyle + '"';
    }
    html += '>';
    html += '<div id="' + tree.id + '_searching" style="display:none">' + tree._getSearchingHtml() + '</div>';
    html += '<div id="' + tree.id + '_loading">' + tree._getLoadingTreeHtml() + '</div>';
    html += '<div id="' + tree.id + '_root"></div>';
    html += '</div>';
    return html;
}

LiveTree.prototype._setupNewItemChildren = function (item) {
    var tree = this;
    if (item.children != null) {
        for (var i = 0; i < item.children.length; i++) {
            var child = item.children[i];
            child.parent = item;
            tree._itemsIndex[child.id] = child;
            tree._setupNewItemChildren(child);
        }
    }
}

LiveTree.prototype._addNewItems = function (newItem) {
    var tree = this;
    var oldItem = tree._getItem(newItem.id);
    if (newItem.children != null && oldItem != null) {
        if (!tree._isLoaded(oldItem)) {
            // Old item has been seen, but its children were not loaded.
            // New item does have children, so add the children to the old item and flag it as as loaded.
            oldItem.children = newItem.children;
            tree._setupNewItemChildren(oldItem);
        } else {
            // Item is already in the tree and has loaded, so recurse to new item's children
            for (var i = 0; i < newItem.children.length; i++) {
                tree._addNewItems(newItem.children[i]);
            }
        }
    }
    return oldItem;
}

LiveTree.prototype._onItemResponse = function (request, onItemCallback, requestOptions) {
    var tree = this;
    if (requestOptions.includeParents && tree._searchCount > 0) {
        tree._searchCount--;
    }
    var item;
    try {
        eval("item = " + request.responseText);
    } catch (e) {
        alert("LiveTree error: cannot parse data from server: " + e);
        tree._stopLoading();
        return;
    }
    
    if (requestOptions.initialRequest) {
        tree._handleInitialItem(item);
    } else {	
        var oldItem = tree._addNewItems(item);
        if (oldItem == null) {
            alert("LiveTree error: cannot add received item to tree");
            tree._stopLoading();
            return;
        }
    }
    onItemCallback(oldItem, requestOptions);
}

LiveTree.prototype._onInitialItemReceived = function () {
    var tree = this;
    this.rootItemId = tree._root.children[0].id;
    Element.hide($(tree.id + "_loading"));
    if (tree.hideRootItem || tree.expandRootItem) {
        tree._expandItem(tree._root.children[0]);
    }
    tree._markItemForUpdateDisplay(tree._root);
    tree._startAutoloads();
    tree._updateDisplay();
}

LiveTree.prototype._handleInitialItem = function (item) {
    var tree = this;
    tree._root.children = [item];
    tree._setupNewItemChildren(tree._root);
}

LiveTree.prototype.start = function () {
    var tree = this;	
    if (tree.initialData != null) {
        tree._handleInitialItem(tree.initialData);
        tree._onInitialItemReceived(tree.initialData);
        tree.initialData = null;
    } else {
        tree._requestItem(tree.rootItemId, (tree.expandRootItem || tree.hideRootItem) ? 2 : 1, tree._onInitialItemReceived.bind(tree), { initialRequest: true });
    }
}

LiveTree.prototype.render = function () {
    var tree = this;	
    document.write(tree.getHtml());
    tree.start();
}

LiveTree.prototype._reloadChildrenOfItem = function (item) {
    var tree = this;
    if (item == null || !tree._isLoaded(item)) {
        return false;
    }
    tree._hideItemChildren(item);
    item.children = null;
    item.isLoading = true;
    tree._requestItem(item.id, 2, tree._onExpandItemReceived.bind(tree));	
    tree._markItemForUpdateDisplay(item);
    tree._updateDisplay();
    return true;
}

LiveTree.prototype.reloadChildrenOfItem = function (itemId) {
    var tree = this;
    return tree._reloadChildrenOfItem(tree._getItem(itemId));    
}

LiveTree.prototype.getActiveItem = function () {
    var tree = this;
    return tree._getItem(tree._activeItemId);
}

LiveTree.prototype.isItemChildOf = function (itemId, parentItemId) {
    var tree = this;
    var item = tree._getItem(itemId);
    if (!item) {
        return false;
    }
    while (item.parent != tree._root) {
        if (item.parent.id == parentItemId) {
            return true;
        }
        item = item.parent;
    }
    return false;
}