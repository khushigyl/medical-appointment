import {Link} from 'react-router-dom'

const CheckoutSuccess = () =>{
    return(
        <div className="h-screen bg-gray-100">
            <div className='p-6 bg-white md:mx-auto'>
                <svg
                viewBox='0 0 24 24'
                className='w-16 h-16 mx-auto my-6 text-green-600'>
                    <path
                    fill='currentColor'
                    d=''
                    ></path>
                </svg>
                
                <div className='text-center'>
                    <h3 className='text-base font-semibold text-center text-gray-900 md:text-2xl'>
                        Payment Done!
                    </h3>
                    <p className='my-2 text-gray-600'>
                        Thank you for completing your secure online payment.
                    </p>
                    <p>Have a great day!</p>

                    <div className='py-10 text-center'>
                        <Link 
                        to={'/home'}
                        className='px-12 py-3 font-semibold text-white bg-buttonBgColor'
                        >
                            Go Back To Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutSuccess