async function fetchBloggerPosts() {
    try {
        const response = await fetch('https://allsciinfo.com/feeds/posts/default?alt=json&max-results=100');
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);

        const text = await response.text();
        const json = JSON.parse(text.replace("])}while(1);</x>", "")); // Remove Blogger's security prefix

        let postsHtml = "";
        json.feed.entry.forEach((post, index) => {
            const title = post.title.$t;
            const link = post.link.find(l => l.rel === 'alternate').href;
            const snippet = post.summary ? post.summary.$t.substring(0, 120) + '...' : "No summary available.";

            postsHtml += `
                <div class="post-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <h3>${title}</h3>
                    <p>${snippet}</p>
                    <a href="${link}" class="read-more" target="_blank">Read More</a>
                </div>
            `;
        });

        document.getElementById('posts').innerHTML = postsHtml;
    } catch (error) {
        console.error("Error fetching posts:", error);
        document.getElementById('posts').innerHTML = `<p style="color:red;">Failed to load posts. Please try again later.</p>`;
    }
}

// Load posts on page load
fetchBloggerPosts();
