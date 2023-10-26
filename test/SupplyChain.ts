import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";

describe("SupplyChainFinancing", function () {
    async function deploySupplyChainFinancingFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const SupplyChainFinancing = await ethers.getContractFactory("SupplyChainFinancing");
        const supplyChainFinancing = await SupplyChainFinancing.deploy();

        return { supplyChainFinancing, owner, otherAccount };
    }

    it("should add a new buyer", async function () {
        const { supplyChainFinancing, owner } = await loadFixture(deploySupplyChainFinancingFixture);
        await supplyChainFinancing.addBuyer(await owner.getAddress());
        const isBuyer = await supplyChainFinancing.isBuyer(await owner.getAddress());
        expect(isBuyer).to.equal(true);
    });

    it("should add a new supplier", async function () {
        const { supplyChainFinancing, owner } = await loadFixture(deploySupplyChainFinancingFixture);
        const supplierDetails = {
            name: "Supplier Name",
            supplierAddress: await owner.getAddress(),
            products: "Product A, Product B",
            TIN: "123456789",
            operatingArea: "Operating Area",
            businessRegistrationNumber: "987654321",
            approvalStatus: true,
        };
        await supplyChainFinancing.addSupplier(
            supplierDetails.name,
            supplierDetails.supplierAddress,
            supplierDetails.products,
            supplierDetails.TIN,
            supplierDetails.operatingArea,
            supplierDetails.businessRegistrationNumber,
            supplierDetails.approvalStatus
        );
        const isSupplier = await supplyChainFinancing.isSupplier(await owner.getAddress());
        expect(isSupplier).to.equal(true);
    });

    it("should create a purchase order", async function () {
        const { supplyChainFinancing, owner } = await loadFixture(deploySupplyChainFinancingFixture);
        await supplyChainFinancing.createPurchaseOrder(await owner.getAddress(), 100);
        const purchaseOrdersLength = await supplyChainFinancing.purchaseOrders.length();
        expect(purchaseOrdersLength).to.equal(1);
    });

    it("should finance a purchase order", async function () {
        const { supplyChainFinancing, owner } = await loadFixture(deploySupplyChainFinancingFixture);
        await supplyChainFinancing.financePurchaseOrder(0);
        const purchaseOrder = await supplyChainFinancing.purchaseOrders(0);
        expect(purchaseOrder.financed).to.equal(true);
    });

    it("should pay the supplier", async function () {
        const { supplyChainFinancing, owner } = await loadFixture(deploySupplyChainFinancingFixture);
        await supplyChainFinancing.paySupplier(0);
        const purchaseOrder = await supplyChainFinancing.purchaseOrders(0);
        expect(purchaseOrder.paid).to.equal(true);
    });
});
