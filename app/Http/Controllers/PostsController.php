<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use App\Models\Post;

class PostsController extends Controller
{
    // Constructor to enforce admin access
    public function __construct()
    {
        // Only admins can create, edit, or delete posts
        // $this->middleware('auth')->only(['store', 'update', 'destroy']);
        // $this->middleware('role')->only(['store', 'update', 'destroy']);
    }

    /**
     * Fetch posts with filters.
     */
    public function index(Request $request)
    {

        if ($request->has('filter')) {
            $param = $request->query('filter');
            $filter = $param === 'oldest' ? 'desc' : 'asc';
        } else {
            $filter = 'asc';  // Default filter if no 'filter' query parameter is provided
        }

        // If search is present, bypass cache and filter manually
        if ($request->has('search')) {
            $search = $request->query('search');

            $posts = Post::where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orderBy('created_at', $filter)
                        ->paginate(10);

            return response()->json($posts);
        }

        // Cache the posts for 5 minutes (300 seconds)
        $posts = Cache::remember("posts_{$filter}", 300, function () use ($filter) {
            // return dd('YOU GOT CACHED!');
            return Post::orderBy('created_at', $filter)->paginate(10);
        });

        // $query = Post::query();

        // // Apply filters based on query parameters
        

        // Optionally, apply additional filters like user or other criteria
        // if ($request->has('user_id')) {
        //     $posts->where('user_id', $request->query('user_id'));
        // }

        // Get posts with pagination (optional) or all posts
        // $posts = $posts->paginate(10); // Adjust pagination as needed (10 posts per page)
        
        return response()->json($posts);
    }

    /**
     * Create a new post.
     */
    public function store(Request $request)
    {
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        // Get the authenticated user
        $user = Auth::user();
        

        $post = Post::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'user_id' => $user->id,
        ]);

        return response()->json($post, 201); // Return the created post with 201 status
    }

    /**
     * Edit an existing post.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $post = Post::findOrFail($id); // Find the post by ID or fail

        $post->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
        ]);

        return response()->json($post, 201); // Return the updated post
    }

    /**
     * Delete a post.
     */
    public function destroy($id)
    {
        $post = Post::findOrFail($id); // Find the post by ID or fail

        $post->delete(); // Delete the post

        return response()->json(null, 204); // Return no content status
    }
}
