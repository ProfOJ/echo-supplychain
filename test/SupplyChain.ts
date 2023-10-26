import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers, Contract } from "hardhat";
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
        await supplyChainFinancing.bypassAddBuyer(await owner.getAddress());
        const isBuyer = await supplyChainFinancing.isBuyer(await owner.getAddress());
        expect(isBuyer).to.equal(true);
    });

    it("should create a purchase order", async function () {
        const { supplyChainFinancing, owner } = await loadFixture(deploySupplyChainFinancingFixture);
        await supplyChainFinancing.bypassAddBuyer(await owner.getAddress());
        await supplyChainFinancing.bypassCreatePurchaseOrder(await owner.getAddress(), 100); // Make sure this address is a valid supplier
        const purchaseOrdersLength = await supplyChainFinancing.getPurchaseOrdersLength(); // Adjusted method call
        expect(purchaseOrdersLength).to.equal(1);
    }); 

    it("should finance a purchase order", async function () {
        const { supplyChainFinancing, owner } = await loadFixture(deploySupplyChainFinancingFixture);
        await supplyChainFinancing.bypassAddBuyer(await owner.getAddress());
        await supplyChainFinancing.bypassCreatePurchaseOrder(await owner.getAddress(), 100); // Make sure this address is a valid supplier
        await supplyChainFinancing.bypassFinancePurchaseOrder(0); // Make sure the index is within bounds
        const purchaseOrder = await supplyChainFinancing.purchaseOrders(0);
        expect(purchaseOrder.financed).to.equal(true);
    });

    it("should pay the supplier", async function () {
        const { supplyChainFinancing, owner } = await loadFixture(deploySupplyChainFinancingFixture);
        await supplyChainFinancing.bypassAddBuyer(await owner.getAddress());
        await supplyChainFinancing.bypassCreatePurchaseOrder(await owner.getAddress(), 100); // Make sure this address is a valid supplier
        await supplyChainFinancing.bypassFinancePurchaseOrder(0); // Make sure the index is within bounds
        await supplyChainFinancing.bypassPaySupplier(0); // Make sure the index is within bounds
        const purchaseOrder = await supplyChainFinancing.purchaseOrders(0);
        expect(purchaseOrder.paid).to.equal(true);
    });
});
