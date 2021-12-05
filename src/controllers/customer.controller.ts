// @Put('update')
// @UseMiddleware('userGuard')
// async updateCustomer(@Req() req, @Res() resp, @Body() body) {
//   const { username, firstName, lastName, address, email } = body;

//   const hasError = validator([
//     {
//       name: 'username',
//       value: username,
//       options: { required: true, isString: true },
//     },
//     {
//       name: 'address',
//       value: address,
//       options: { required: true, isString: true },
//     },
//     {
//       name: 'firstname',
//       value: firstName,
//       options: { required: true, isString: true },
//     },
//     {
//       name: 'lastname',
//       value: lastName,
//       options: { required: true, isString: true },
//     },
//     {
//       name: 'email',
//       value: email,
//       options: { required: true, isString: true, isEmail: true },
//     },
//   ]);

//   if (!hasError) {
//     const user = await this.customerService.updateCustomer(body);

//     resp.json({ user, descrption: 'operaton sucessful', code: 0 });
//   } else {
//     throw new NotAcceptableException('', hasError?.[0].msg[0]);
//   }
// }

// @Get('balance')
// async getBalanceController(@Req() req, @Res() resp) {
//   let { customerId } = req.query;

//   const errorMsgs = validator([
//     {
//       name: 'customer id',
//       value: +customerId,
//       options: { required: true, isNumber: true },
//     },
//   ]);

//   if (errorMsgs) {
//     throw new NotAcceptableException(null, errorMsgs?.[0].msg?.[0]);
//   }

//   const balance = await this.customerService.getCustomersBalance(customerId);

//   resp.json({
//     code: 0,
//     description: 'operation successful',
//     balance,
//   });
// }
