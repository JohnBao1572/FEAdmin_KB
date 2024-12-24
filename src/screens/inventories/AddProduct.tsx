/** @format */
import { Editor } from '@tinymce/tinymce-react';
import {
	Button,
	Card,
	Divider,
	Form,
	Input,
	message,
	Select,
	Space,
	Spin,
	TreeSelect,
	Typography,
	Image,
	Upload,
	UploadProps,
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import handleAPI from '../../apis/handleAPI';
import { SelectModel, TreeModel } from '../../models/FormModel';
import { replaceName } from '../../utils/replaceName';
import { uploadFile } from '../../utils/uploadFile';
import { Add } from 'iconsax-react';
import { getTreeValues } from '../../utils/getTreeValues';
import { useSearchParams } from 'react-router-dom';

import ModalCategory from '../../modals/ModalCategory';



const { Text, Title, Paragraph } = Typography;

const AddProduct = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [content, setcontent] = useState('');
	const [supplierOptions, setSupplierOptions] = useState<SelectModel[]>([]);
	const [isVisibleAddCategory, setIsVisibleAddCategory] = useState(false);
	const [categories, setCategories] = useState<TreeModel[]>([]);
	const [isCreating, setIsCreating] = useState(false);
	const [fileUrl, setFileUrl] = useState('');
	const [fileList, setFileList] = useState<any[]>([]);

	const [searchParams] = useSearchParams();

	const id = searchParams.get('id');

	const editorRef = useRef<any>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		if (id) {
			getProductDetail(id);
		}
	}, [id]);

	const getData = async () => {
		setIsLoading(true);
		try {
			await getSuppliers();
			await getCategories();
		} catch (error: any) {
			message.error(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const getProductDetail = async (id: string) => {
		const api = `/products/detail?id=${id}`;
		try {
			const res = await handleAPI(api);
			const item = res.data;

			if (item) {
				form.setFieldsValue(item);
				setcontent(item.content);
				if (item.images && item.images.length > 0) {
					const items = [...fileList];
					item.images.forEach((url: string) =>
						items.push({
							uid: `${Math.floor(Math.random() * 1000000)}`,
							name: url,
							status: 'done',
							url,
						})
					);

					setFileList(items);
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	// const handleAddNewProduct = async (values: any) => {
	// 	const content = editorRef.current.getContent();
	// 	const data: any = {};
	// 	setIsCreating(true);
	// 	for (const i in values) {
	// 		data[`${i}`] = values[i] ?? '';
	// 	}

	// 	data.content = content;
	// 	data.slug = replaceName(values.title);

	// 	if (fileList.length > 0) {
	// 		const urls: string[] = [];
	// 		fileList.forEach(async (file) => {
	// 			if (file.originFileObj) {
	// 				const url = await uploadFile(file.originFileObj);
	// 				url && urls.push(url);
	// 			} else {
	// 				urls.push(file.url);
	// 			}
	// 		});

	// 		data.images = urls;
	// 	}

	// 	try {
	// 		await handleAPI(
	// 			`/products/${id ? `update?id=${id}` : 'add-new'}`,
	// 			data,
	// 			id ? 'put' : 'post'
	// 		);
	// 		window.history.back();
	// 	} catch (error) {
	// 		console.log(error);
	// 	} finally {
	// 		setIsCreating(false);
	// 	}
	// };


	const handleAddNewProduct = async (values: any) => {
		// Bắt đầu quá trình tạo sản phẩm
		setIsCreating(true);
	
		// Kiểm tra xem editorRef.current có tồn tại không
		if (!editorRef.current) {
			console.error("Editor is not initialized");
			setIsCreating(false);
			return; // Thoát khỏi hàm nếu editor chưa sẵn sàng
		}
	
		// Lấy nội dung từ editor
		const content = editorRef.current.getContent();
		const data: any = {};
	
		// Gán giá trị từ values vào data
		for (const key in values) {
			data[key] = values[key] !== undefined ? values[key] : ''; // Đảm bảo không có giá trị undefined
		}
	
		// Thêm nội dung và slug vào data
		data.content = content;
		data.slug = replaceName(values.title);
	
		// Nếu có file trong fileList, xử lý upload
		if (fileList.length > 0) {
			const uploadPromises = fileList.map(async (file) => {
				if (file.originFileObj) {
					// Upload file và trả về URL
					return await uploadFile(file.originFileObj);
				} else {
					// Nếu file đã có URL, trả về URL đó
					return file.url;
				}
			});
	
			// Chờ tất cả các upload hoàn tất và lọc các URL hợp lệ
			const urls = await Promise.all(uploadPromises);
			data.images = urls.filter(Boolean); // Chỉ giữ lại các URL hợp lệ
		}
	
		try {
			// Gọi API để thêm hoặc cập nhật sản phẩm
			await handleAPI(
				`/products/${id ? `update?id=${id}` : 'add-new'}`,
				data,
				id ? 'put' : 'post'
			);
			// Quay lại trang trước đó
			window.history.back();
		} catch (error) {
			console.error("Error while adding/updating product:", error); // Ghi lại lỗi
		} finally {
			// Kết thúc quá trình tạo sản phẩm
			setIsCreating(false);
		}
	};
	
	const getSuppliers = async () => {
		const api = `/supplier`;
		const res = await handleAPI(api);

		const data = res.data.items;
		const options = data.map((item: any) => ({
			value: item._id,
			label: item.name,
		}));

		setSupplierOptions(options);
	};

	const getCategories = async () => {
		const res = await handleAPI(`/products/get-categories`);
		const datas = res.data;

		const data = datas.length > 0 ? getTreeValues(datas, true) : [];

		setCategories(data);
	};

	const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
		const items = newFileList.map((item) =>
			item.originFileObj
				? {
					...item,
					url: item.originFileObj
						? URL.createObjectURL(item.originFileObj)
						: '',
					status: 'done',
				}
				: { ...item }
		);

		setFileList(items);
	};

	return isLoading ? (
		<Spin />
	) : (
		<div>
			<div className='container'>
				<Title level={3}>Add new Product</Title>
				<Form
					disabled={isCreating}
					size='large'
					form={form}
					onFinish={handleAddNewProduct}
					layout='vertical'>
					<div className='row'>
						<div className='col-8'>
							<Form.Item
								name={'title'}
								label='Title'
								rules={[
									{
										required: true,
										message: 'Please enter product title',
									},
								]}>
								<Input allowClear maxLength={150} showCount />
							</Form.Item>
							<Form.Item name={'description'} label='Description'>
								<Input.TextArea
									maxLength={1000}
									showCount
									rows={4}
									allowClear
								/>
							</Form.Item>
							<Editor
								apiKey='4e6s1ecixduh2v296dk7gw6132b5v5c1iua4bhy2wwomkywt'
								init={{
									plugins: [
										'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount'
									  ],
									toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
									tinycomments_mode: 'embedded',
									tinycomments_author: 'Author name',
									mergetags_list: [
										{ value: 'First.Name', title: 'First Name' },
										{ value: 'Email', title: 'Email' },
									],
									ai_request: (request: any, respondWith: { string: (arg0: () => Promise<never>) => any; }) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
								}}

								onInit={(evt, editor) => editorRef.current = editor}
								initialValue="Chào mừng đến với trung tâm thương mại Thiên Bảo"
							/>
						</div>
						<div className='col-4'>
							<Card size='small' className='mt-4'>
								<Space>
									<Button
										loading={isCreating}
										size='middle'
										onClick={() => form.submit()}>
										Cancel
									</Button>
									<Button
										loading={isCreating}
										type='primary'
										size='middle'
										onClick={() => form.submit()}>
										{id ? 'Update' : 'Submit'}
									</Button>
								</Space>
							</Card>
							<Card size='small' className='mt-3' title='Categories'>
								<Form.Item name={'categories'}>
									<TreeSelect
										treeData={categories}
										multiple
										dropdownRender={(menu) => (
											<>
												{menu}

												<Divider className='m-0' />
												<Button
													onClick={() => setIsVisibleAddCategory(true)}
													type='link'
													icon={<Add size={20} />}
													style={{
														padding: '0 16px',
													}}>
													Add new
												</Button>
											</>
										)}
									/>
								</Form.Item>
							</Card>
							<Card size='small' className='mt-3' title='Suppliers'>
								<Form.Item
									name={'supplier'}
									rules={[
										{
											required: true,
											message: 'Required',
										},
									]}>
									<Select
										showSearch
										filterOption={(input, option) =>
											replaceName(option?.label ? option.label : '').includes(
												replaceName(input)
											)
										}
										options={supplierOptions}
									/>
								</Form.Item>
							</Card>
							<Card size='small' className='mt-3' title='Images'>
								<Upload
									multiple
									fileList={fileList}
									accept='image/*'
									listType='picture-card'
									onChange={handleChange}>
									Upload
								</Upload>
							</Card>
							<Card className='mt-3'>
								<Input
									allowClear
									value={fileUrl}
									onChange={(val) => setFileUrl(val.target.value)}
									className='mb-3'
								/>
								<Input
									type='file'
									accept='image/*'
									onChange={async (files: any) => {
										const file = files.target.files[0];

										if (file) {
											const donwloadUrl = await uploadFile(file);
											donwloadUrl && setFileUrl(donwloadUrl);
										}
									}}
								/>
							</Card>
						</div>
					</div>
				</Form>
			</div>

			<ModalCategory
				visible={isVisibleAddCategory}
				onClose={() => setIsVisibleAddCategory(false)}
				onAddNew={async (val) => {
					await getCategories();
				}}
				values={categories}
			/>
		</div>
	);
};

export default AddProduct;


