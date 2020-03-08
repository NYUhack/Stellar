import argparse
import os
import numpy as np
import math

import torchvision.transforms as transforms
from torchvision.utils import save_image

from torch.utils.data import DataLoader
from torchvision import datasets
from torch.autograd import Variable

import torch.nn as nn
import torch.nn.functional as F
import torch

from torch.distributions.normal import Normal
import matplotlib.pyplot as plt
import pandas as pd
from shapely.geometry import Point
import geopandas as gpd

#------------------------------
#       Reading CSV Data
#------------------------------
#Date, Time, Latitude, Longitude, Type, Depth, Depth Error, Depth Seismic Stations, Magnitude, Magnitude Type, Magnitude Error, Magnitude Seismic Stations, Azimuthal Gap, Horizontal Distance, Horizontal Error, Root Mean Square, ID,Source, Location Source, Magnitude Source, Status

df = pd.read_csv('database.csv')
allData = pd.read_csv('database.csv').to_numpy()
data = torch.tensor(allData[:,(2,3,8)].astype(float)).float()    # Latitude, Longitude,Magnitude             N = 23412

"""
#---------------------------------------------
# Generating samples from normal distribution
#---------------------------------------------

#dataDist =  Normal(torch.tensor([0.0]), torch.tensor([1.0]))
#data = dataDist.sample([numsamples])
data = torch.Tensor(np.random.normal(0, 1, (numsamples , outputDim)))
data[:,0] = data[:,0] * 45                  # Latitudinal datapoints
data[:,1] = data[:,1] * 90                  # Longitudinal datapoints
"""


numsamples = data.size()[0]
outputDim = 3
latentFeatures = 200                            # Number of latent variables / Latent dim


os.makedirs("images", exist_ok=True)

parser = argparse.ArgumentParser()
parser.add_argument("--n_epochs", type=int, default=10, help="number of epochs of training")
parser.add_argument("--batch_size", type=int, default=256, help="size of the batches")
#parser.add_argument("--lr", type=float, default=0.0002, help="adam: learning rate")
parser.add_argument("--lr", type=float, default=0.000002, help="adam: learning rate")
parser.add_argument("--b1", type=float, default=0.5, help="adam: decay of first order momentum of gradient")
parser.add_argument("--b2", type=float, default=0.999, help="adam: decay of first order momentum of gradient")
parser.add_argument("--n_cpu", type=int, default=8, help="number of cpu threads to use during batch generation")
parser.add_argument("--latent_dim", type=int, default=latentFeatures, help="dimensionality of the latent space")
parser.add_argument("--sample_interval", type=int, default=400, help="interval betwen image samples")
opt = parser.parse_args()
print(opt)


data_shape = ( 1 , outputDim )

# breaking data to batches
batches = int(data.shape[0]/ opt.batch_size)
batchData = data[:batches * opt.batch_size ].view( batches , opt.batch_size, 1 , outputDim )


cuda = True if torch.cuda.is_available() else False


class Generator(nn.Module):
    def __init__(self):
        super(Generator, self).__init__()

        def block(in_feat, out_feat, normalize=True):
            layers = [nn.Linear(in_feat, out_feat)]
            if normalize:
                layers.append(nn.BatchNorm1d(out_feat, 0.8))
            layers.append(nn.LeakyReLU(0.2, inplace=True))
            return layers

        self.model = nn.Sequential(
            *block(opt.latent_dim, 128, normalize=False),
            *block(128, 256),
            *block(256, 512),
            *block(512, 1024),
            nn.Linear(1024, int(np.prod(data_shape) ) ),
            nn.Linear(int(np.prod(data_shape)), int(np.prod(data_shape) ) ),
            #nn.Tanh()
        )

    def forward(self, z):                               # Z is a latent variable
        output = self.model(z)
        output = output.view(output.size(0), *data_shape)
        print(output)
        return output


class Discriminator(nn.Module):
    def __init__(self):
        super(Discriminator, self).__init__()

        self.model = nn.Sequential(
            nn.Linear(int(np.prod(data_shape)), 512),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Linear(512, 256),
            nn.LeakyReLU(0.2, inplace=True),
            nn.Linear(256, 1),
            nn.Sigmoid(),
        )

    def forward(self, sample):
        sample_flat = sample.view(sample.size(0), -1)
        validity = self.model(sample_flat)
        return validity


# Loss function
#adversarial_loss = torch.nn.BCELoss()
adversarial_loss = torch.nn.MSELoss()

# Initialize generator and discriminator
generator = Generator()
discriminator = Discriminator()

if cuda:
    generator.cuda()
    discriminator.cuda()
    adversarial_loss.cuda()

# Optimizers
optimizer_G = torch.optim.Adam(generator.parameters(), lr=opt.lr, betas=(opt.b1, opt.b2))
optimizer_D = torch.optim.Adam(discriminator.parameters(), lr=opt.lr, betas=(opt.b1, opt.b2))

Tensor = torch.cuda.FloatTensor if cuda else torch.FloatTensor

# ----------
#  Training
# ----------

for epoch in range(opt.n_epochs):
    for i, datapoints in enumerate(batchData):

        # Adversarial ground truths
        valid = Variable(Tensor(datapoints.size(0), 1).fill_(1.0), requires_grad=False)
        fake = Variable(Tensor(datapoints.size(0), 1).fill_(0.0), requires_grad=False)

        # Configure input
        real_samples = Variable(datapoints.type(Tensor))

        # -----------------
        #  Train Generator
        # -----------------

        optimizer_G.zero_grad()

        # Sample noise as generator input
        z = Variable(Tensor(np.random.normal(0, 1, (datapoints.size(0), opt.latent_dim))))

        # Generate a batch of samples
        gen_samples = generator(z)
        
        
        # Loss measures generator's ability to fool the discriminator
        g_loss = adversarial_loss(discriminator(gen_samples), valid)

        g_loss.backward()
        optimizer_G.step()

        # ---------------------
        #  Train Discriminator
        # ---------------------

        optimizer_D.zero_grad()

        # Measure discriminator's ability to classify real from generated samples
        real_loss = adversarial_loss(discriminator(real_samples), valid)
        fake_loss = adversarial_loss(discriminator(gen_samples.detach()), fake)
        d_loss = (real_loss + fake_loss) / 2

        d_loss.backward()
        optimizer_D.step()

        print(
            "[Epoch %d/%d] [Batch %d/%d] [D loss: %f] [G loss: %f]"
            % (epoch, opt.n_epochs, i, len(batchData), d_loss.item(), g_loss.item())
        )

        batches_done = epoch * len(data) + i
        """
        if batches_done % opt.sample_interval == 0:
            save_image(gen_samples.data[:25], "images/%d.png" % batches_done, nrow=5, normalize=True)
        """


numsamples = 2000
# Generate latent vars
z = Variable(Tensor(np.random.normal(0, 1, (numsamples, opt.latent_dim))))

# Generate a batch of samples
gen_samples = generator(z)

plt.plot(gen_samples[:,:,0].detach().numpy(),gen_samples[:,:,1].detach().numpy(),"o")
plt.show()

# Saving model
PATH = './savedModel.pth'
torch.save(generator.state_dict(), PATH)

# Exporting to ONNX
dummy_input = torch.tensor(np.random.normal(0, 1, (1, opt.latent_dim) )).float()
print(dummy_input.size())
torch.onnx.export( generator, dummy_input , "officialGenerativeModel.onnx", verbose=True, input_names=["Input"], output_names=["Output"])

# GEO Plot
df = pd.DataFrame(gen_samples.view(1000,3).detach().numpy())

geometry = [Point(xy) for xy in zip(df[1], df[2])]
gdf = gpd.GeoDataFrame(df, geometry=geometry)

#this is a simple map that goes with geopandas
world = gpd.read_file(gpd.datasets.get_path('naturalearth_lowres'))
gdf.plot(ax=world.plot(figsize=(10, 6)), marker='o', color='red', markersize=15);
plt.show()

print("Sucessful!")
