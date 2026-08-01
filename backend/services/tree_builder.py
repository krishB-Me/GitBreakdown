# This is the function used to build the tree strucuter from that flat JSON we got from github

def tree_builder(tree_json):
    if not tree_json or "tree" not in tree_json: 
        print("The JSON from Github doesn't have any key tree")
        return []

    tree = []
    nodes_by_path = {}
    # creating the nodes for every path
    for element in tree_json["tree"]:
        path = element["path"]
        parts = [p for p in path.strip().strip("/").split("/") if p]

        nodes_by_path[path] = {
            "name": parts[-1],
            "type": "folder" if element["type"] == "tree" else "file",
            "path": path,
            "children": [] if element["type"] == "tree" else None
        }

        """
        What we are trying to do is make a complete deep tree of one branch like 
        the whole src branch is made completely with all their children in JSON and stored 
        in nodes_by_path and is onlny moved to final tree dict when we reach the top level 
        of the dir
        and if a file is stand-alone it's automatically added to tree rather than going to 
        node_by_path first.
        """
        # making the parent-child relationships
        parent_path = "/".join(parts[:-1])
        if parent_path:
            if parent_path in nodes_by_path:
                nodes_by_path[parent_path]["children"].append(nodes_by_path[path])
            else:
                # If parent is not in the map, treat it as a root-level node for safety
                tree.append(nodes_by_path[path]) 
        else:
            # Top-level item
            tree.append(nodes_by_path[path])

    return tree