import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button, styled } from '@mui/material';
import { Link } from 'react-router-dom';
import { ShoppingBag } from '@mui/icons-material';

const StyledCard = styled(Card)({
  maxWidth: 345,
  height: 400,
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const StyledCardMedia = styled(CardMedia)({
  height: 200,
});

// Sample product data with Google images
const products = [
  { id: 1, name: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D', description: 'Comfortable running shoes', points: 100, category: 'Footwear' },
  { id: 2, name: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D', description: 'Noise-cancelling headphones', points: 200, category: 'Electronics' },
  { id: 3, name: 'Mobile Phone', image: 'https://img.freepik.com/premium-photo/smartphone-balancing-with-pink-background_23-2150271746.jpg', description: 'Latest smartphone', points: 300, category: 'Electronics' },
  { id: 4, name: 'T-shirt', image: 'https://merchshop.in/wp-content/uploads/2019/06/Mobile-App-Developer-t-shirt-golden-yellow.jpg', description: 'Cotton t-shirt', points: 50, category: 'Apparel' },
  { id: 5, name: 'Cap', image: 'https://rukminim3.flixcart.com/image/850/1000/xif0q/cap/c/y/m/free-latest-side-ny-baseball-cap-highever-original-imagnm8fvyf9jbpv.jpeg?q=90&crop=false', description: 'Stylish cap', points: 30, category: 'Accessories' },
  { id: 6, name: 'Laptop', image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXBwbGUlMjBsYXB0b3B8ZW58MHx8MHx8fDA%3D', description: 'High performance laptop', points: 500, category: 'Electronics' },
  { id: 7, name: 'Watch', image: 'https://www.titan.co.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw7646cf71/images/Titan/Catalog/90140QM03_1.jpg?sw=600&sh=600', description: 'Smart watch', points: 150, category: 'Accessories' },
  { id: 8, name: 'Tablet', image: 'https://lh3.googleusercontent.com/EiyFFXsrDV1pdJLDZisKdovVAVDmJHAk3qR-7GkWpvIMyfGIZerzPVNn5JTFocIvTe4plNeCRn3m4wrlbBuBJTrq-G7W-Yi1ID0=s0', description: 'Portable tablet', points: 250, category: 'Electronics' },
  { id: 9, name: 'Camera', image: 'https://www.dpreview.com/files/p/articles/6269402639/canon_eosr8.jpeg', description: 'Digital camera', points: 350, category: 'Electronics' },
  { id: 10, name: 'Speaker', image: 'https://carxtreme.in/wp-content/uploads/2023/08/5inch-speaker-box-2.jpg', description: 'Bluetooth speaker', points: 120, category: 'Electronics' },
  { id: 11, name: 'Backpack', image: 'https://rukminim2.flixcart.com/image/850/1000/ktszgy80/backpack/2/y/0/arc-backpack-unisex-with-rain-cover-w-038-backpack-wrogn-original-imag72jxnsyxtsfw.jpeg?q=90&crop=false', description: 'Durable backpack', points: 80, category: 'Accessories' },
  { id: 12, name: 'Sunglasses', image: 'https://megafashion.co.in/storage/2024/12/Mens-Lacoste-Sunglasses-Sliver-Black.jpg', description: 'Stylish sunglasses', points: 60, category: 'Accessories' },
  { id: 13, name: 'Jacket', image: 'https://yourdesignstore.s3.amazonaws.com/uploads/yds/productImages/thumb/1629717737612384e9619ceYDS_Product_4@2x.jpg', description: 'Warm jacket', points: 200, category: 'Apparel' },
  { id: 14, name: 'Sneakers', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&ixid=M3wxMjA3fDB8MHxwaG90by1wYWNrYWdlfDEzOXx8c25lYWtlcnN8ZW58MHx8fHx8fDE2NzM4MTk5OTg&ixlib=rb-1.2.1&q=80&w=400', description: 'Fashionable sneakers', points: 110, category: 'Footwear' },
  { id: 15, name: 'Earbuds', image: 'https://cdn.mos.cms.futurecdn.net/wTz9tnVKS3ieMYqDMZYEWf.jpg', description: 'Wireless earbuds', points: 90, category: 'Electronics' },
  { id: 16, name: 'Fitness Tracker', image: 'https://www.apple.com/newsroom/images/2023/09/apple-introduces-the-advanced-new-apple-watch-series-9/article/Apple-Watch-S9-hero-230912_Full-Bleed-Image.jpg.large.jpg', description: 'Fitness tracker', points: 130, category: 'Electronics' },
  { id: 17, name: 'Gaming Console', image: 'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?cs=srgb&dl=pexels-pixabay-275033.jpg&fm=jpg', description: 'Latest gaming console', points: 400, category: 'Electronics' },
  { id: 18, name: 'Keyboard', image: 'https://static.toiimg.com/thumb/msid-112869139,imgsize-1255108,width-400,resizemode-4/112869139.jpg', description: 'Mechanical keyboard', points: 70, category: 'Electronics' },
  { id: 19, name: 'Mouse', image: 'https://www.intex.in/cdn/shop/files/Nova_1024x1024.png?v=1720503757', description: 'Wireless mouse', points: 40, category: 'Electronics' },
  { id: 20, name: 'Monitor', image: 'https://dlcdnwebimgs.asus.com/gain/F16EB30F-1A79-4F66-9A23-F1B1D120F4F3/w750/h470', description: '4K monitor', points: 300, category: 'Electronics' },
];


const FeatureProducts = () => {
  return (
    <div>
      <Typography variant="h4">Feature Products</Typography>
      <Grid container spacing={4} mt={5}>
        {products.map(product => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <StyledCard>
              <StyledCardMedia
                image={product.image}
                title={product.name}
              />
              <CardContent>
                <Typography variant="h6" component="div" fontWeight={600}>{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">{product.description}</Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>Points: {product.points}</Typography>
                <Typography variant="body2" color="text.secondary">Category: {product.category}</Typography>
                <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    View Product <ShoppingBag sx={{ fontSize: 20 }} />
                  </Button>
                </Link>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default FeatureProducts;
