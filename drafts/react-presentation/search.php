<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search results</title>
</head>
<body>
    <?php if ( is_home() ) : ?>
        <h1 class="page-title"><?php single_post_title(); ?></h1>
    <?php elseif( is_search() ): ?>
        <h1 class="page-title"><?php _e( 'Search results for:', 'nd_dosth' ); ?></h1>
        <div class="search-query"><?php echo get_search_query(); ?></div>    
    <?php endif; ?>
</body>
</html>