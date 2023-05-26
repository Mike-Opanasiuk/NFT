import { Carousel } from "react-bootstrap";
import './CustomCarousel.scss';
import { BASE_URL, ICollection } from "../../react-app-env.d";

export const CustomCarousel = ({ data }: {
    data: ICollection[]
}) => {
    return (
        <Carousel variant="light" className="w-80 m-auto">
            {
                data.map(item => (
                    <Carousel.Item>
                        <img
                            className="carousel-img"
                            key={item.id}
                            src={item?.image == null ?
                                '../ImageNotFound.png'
                                : `${BASE_URL}/${item?.image}`
                            }
                            alt="Slide"
                        />
                        <Carousel.Caption>
                            <h5 className="text-light">{item.name}</h5>
                            <p>by @{item.author.userName}</p>
                        </Carousel.Caption>
                    </Carousel.Item>))
            }
            {/* <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="https://mdbcdn.b-cdn.net/img/Photos/Slides/img%20(15).webp"
                    alt="First slide"
                />
                <Carousel.Caption className="h-100 d-flex flex-column justify-content-between">
                    <div className="pt-5">
                        <a className="text-muted" href="https://economictimes.indiatimes.com/markets/cryptocurrency/what-india-can-learn-from-eus-crypto-regulations/articleshow/100026888.cms?utm_source=contentofinterest&utm_medium=text&utm_campaign=cppst">
                            <h3 className="text-muted">What India can learn from EU's crypto regulations</h3>
                        </a>
                    </div>
                    <div className="w-50">
                        <p className="txt-justify">
                            The European Parliament's approval of the Markets in Crypto-Assets Regulation (MiCA) is a significant milestone in regulating crypto-assets in the European Union. The regulation introduces a tailored license for crypto-asset services and stablecoin issuers that can be used across all 27 EU member states, streamlining regulatory processes and fostering cross-border activities in the crypto industry. MiCA differentiates between types of cryptoassets, tailoring regulatory requirements to each category.
                        </p>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="https://mdbcdn.b-cdn.net/img/Photos/Slides/img%20(22).webp"
                    alt="Second slide"
                />
                <Carousel.Caption>
                    <h5 className="text-light">Second slide label</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src="https://mdbcdn.b-cdn.net/img/Photos/Slides/img%20(23).webp"
                    alt="Third slide"
                />
                <Carousel.Caption>
                    <h5 className="text-light">Third slide label</h5>
                    <p>
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                    </p>
                </Carousel.Caption>
            </Carousel.Item> */}
        </Carousel>
    )
}