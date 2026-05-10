import { Response } from "express";
import { sendSuccess, sendCreated, sendPaginated, sendError } from "../../utils/response";

function mockRes(): Response {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("sendSuccess", () => {
  it("sends a 200 response with data", () => {
    const res = mockRes();
    sendSuccess(res, { id: 1 }, "OK");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "OK",
      data: { id: 1 },
    });
  });

  it("defaults message to 'Success'", () => {
    const res = mockRes();
    sendSuccess(res, "data");
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Success" })
    );
  });
});

describe("sendCreated", () => {
  it("sends a 201 response", () => {
    const res = mockRes();
    sendCreated(res, { id: 1 });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });
});

describe("sendPaginated", () => {
  it("sends a 200 response with pagination meta", () => {
    const res = mockRes();
    const data = [{ id: 1 }];
    const meta = { page: 1, limit: 10, total: 1, totalPages: 1 };
    sendPaginated(res, data, meta, "Fetched");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Fetched",
      data,
      meta,
    });
  });
});

describe("sendError", () => {
  it("sends an error response with default status 500", () => {
    const res = mockRes();
    sendError(res, "Something went wrong");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Something went wrong",
    });
  });

  it("includes errors when provided", () => {
    const res = mockRes();
    sendError(res, "Validation failed", 400, [{ field: "name", message: "required" }]);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Validation failed",
      errors: [{ field: "name", message: "required" }],
    });
  });
});
