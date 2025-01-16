import React, {useState, useEffect} from 'react'
import { ShopContext} from '../context/ShopContext'
import { useContext } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Collection = () => {
  const { products, search, showSearch, loading, error } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState([])
  const [type, setType] = useState([])
  const [sortType, setSortType] = useState('relevant')
  
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleType = (e) => {
    if (type.includes(e.target.value)) {
      setType(prev => prev.filter(item => item !== e.target.value))
    } else {
      setType(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    if (!products) return; // Guard clause for when products is null/undefined
    
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filter by category
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => 
        item.category && category.includes(item.category.name)
      );
    }
  
    // Filter by subcategory
    if (type.length > 0) {
      productsCopy = productsCopy.filter(item => 
        item.type && type.includes(item.type.name)
      );
    }
  
    setFilterProducts(productsCopy);
  }

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b) => (a.price - b.price)));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b) => (b.price - a.price)));
        break;
      default:
        applyFilter();
        break;
    }
  }

  useEffect(() => {
    if (products) {
      setFilterProducts(products);
    }
  }, [products])

  useEffect(() => {
    applyFilter();
  }, [category, type, search, showSearch, products])

  useEffect(() => {
    sortProduct();
  }, [sortType])

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-600 min-h-[400px] flex items-center justify-center">
      Error loading products: {error}
    </div>
  );

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Filter options*/}
      <div className='min-w-60'>
        <p onClick={()=> setShowFilter(!showFilter)} 
           className='my-2 text-xl flex items-center cursor-pointer gap-2'>
          FILTERS
          <img 
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} 
            src={assets.dropdown_icon} 
            alt=""
          />
        </p>
        
        {/* Category Filter*/}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {['Men', 'Women', 'Kids'].map((cat) => (
              <p key={cat} className='flex gap-2'>
                <input 
                  className='w-3' 
                  type='checkbox' 
                  value={cat} 
                  checked={category.includes(cat)}
                  onChange={toggleCategory}
                /> 
                {cat}
              </p>
            ))}
          </div>
        </div>

        {/* SubCategory Filter*/}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {['Topwear', 'Bottomwear', 'Winterwear'].map((subCat) => (
              <p key={subCat} className='flex gap-2'>
                <input 
                  className='w-3' 
                  type='checkbox' 
                  value={subCat} 
                  checked={type.includes(subCat)}
                  onChange={toggleType}
                /> 
                {subCat}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/*Right side*/}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTION'}/>
          {/*Product Sort */}
          <select 
            onChange={(e)=> setSortType(e.target.value)} 
            value={sortType}
            className='border-2 border-gray-300 text-sm px-2'
          >
            <option value='relevant'>Sort by: Relevant</option>
            <option value='low-high'>Sort by: Low to High</option>
            <option value='high-low'>Sort by: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        {filterProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No products found matching your criteria
          </div>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
            {filterProducts.map((item) => (
              <ProductItem 
                key={item._id}
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.images}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Collection
