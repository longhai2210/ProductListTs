import React, { Component } from "react";
import axios from "axios";
import { RouteComponentProps } from "react-router-dom";
import ProductItem from "./ProductItem";
import ProductSearch from "./ProductSearch";

interface IState {
	products: any[];
	inputValue: string;
}

export default class ProductsList extends Component<
	RouteComponentProps,
	IState
> {
	constructor(props: RouteComponentProps) {
		super(props);
		this.state = {
			products: [],
			inputValue: "",
		};
	}

	public componentDidMount(): void {
		axios.get(`http://localhost:5000/products`).then((data) => {
			this.setState({ products: data.data });
		});
	}

	private deleteProduct = (id: any) => {
		axios.delete(`http://localhost:5000/products/${id}`).then((data) => {
			const index = this.state.products.findIndex(
				(product) => product.id === id
			);
			this.state.products.splice(index, 1);
			this.props.history.push("/");
		});
	};

	private handleInputValueChange = (param: any) => {
		this.setState({
			inputValue: param,
		});
		axios.get(`http://localhost:5000/products?q=${param}`).then((data) => {
			this.setState({ products: data.data, inputValue: " " });
		});
	};

	private filterProduct = async (param: any) => {
		await axios
			.get(`http://localhost:5000/products?q=${param}`)
			.then((data) => {
				this.setState({ products: data.data, inputValue: " " });
			});
	};

	render() {
		const products = this.state.products;
		return (
			<div>
				<ProductSearch
					onValueChange={this.handleInputValueChange}
					onFilter={this.filterProduct}
				/>
				{products.length === 0 && (
					<div className="text-center">
						<h2>No product found at the moment</h2>
					</div>
				)}
				<ProductItem
					products={this.state.products}
					productDelete={this.deleteProduct}
				/>
			</div>
		);
	}
}
