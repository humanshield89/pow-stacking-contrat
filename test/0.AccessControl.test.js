const { expect } = require("chai");

describe("Access Control Contract", function () {
  it("SHould deploy correctly", async function () {
    const [owner, admin1, nonAdmin] = await ethers.getSigners();

    const AccessControl = await ethers.getContractFactory("AccessControl");

    this.accessControl = await AccessControl.deploy(/* args */);
  });

  it("Should set the owner as the owner", async function () {
    const [owner, admin1, nonAdmin] = await ethers.getSigners();

    expect(await this.accessControl.owner()).to.equal(owner.address);
  });

  // should fails to add admin by non owner
  it("Should fails to add admin by non owner", async function () {
    const [owner, admin1, nonAdmin] = await ethers.getSigners();

    await expect(
      this.accessControl.connect(nonAdmin).addAdmin(admin1.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  // should fail to add address zero tp admins by owner
  it("Should fail to add address zero tp admins by owner", async function () {
    const [owner, admin1, nonAdmin] = await ethers.getSigners();

    await expect(
      this.accessControl.addAdmin(ethers.constants.AddressZero)
    ).to.be.revertedWith("AccessControl: !zeroAddress");
  });

  // it should allow owner to set admin
  it("Should allow owner to set admin", async function () {
    const [owner, admin1, nonAdmin] = await ethers.getSigners();

    await this.accessControl.addAdmin(admin1.address);
    expect(await this.accessControl.isAdmin(admin1.address)).to.equal(true);
  });

  // it should allow admin to renounce adminship
  it("Should allow admin to renounce adminship", async function () {
    const [owner, admin1, nonAdmin] = await ethers.getSigners();

    await this.accessControl.connect(admin1).renounceAdminship();
    expect(await this.accessControl.isAdmin(admin1.address)).to.equal(false);
  });

  it("Should allow only owner to remove admin", async function () {
    const [owner, admin1, nonAdmin] = await ethers.getSigners();

    await this.accessControl.addAdmin(admin1.address);
    expect(await this.accessControl.isAdmin(admin1.address)).to.equal(true);

    expect(
      this.accessControl.connect(admin1).removeAdmin(admin1.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");

    await this.accessControl.removeAdmin(admin1.address);

    expect(await this.accessControl.isAdmin(admin1.address)).to.equal(false);
  });
});
