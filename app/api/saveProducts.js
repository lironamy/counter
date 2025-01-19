import dbConnect from '@/lib/dbConnect'; 
import Product from '@/models/Product';   

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const productsData = req.body; 

      const operations = productsData.map(async (prod) => {
        return Product.findOneAndUpdate(
          { name: prod.name },
          prod,
          { new: true, upsert: true }
        );
      });

      const savedProducts = await Promise.all(operations);
      return res.status(200).json({ success: true, data: savedProducts });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
