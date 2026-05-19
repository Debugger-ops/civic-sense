'use client';
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { TrendingUp, Users, MapPin } from "lucide-react";
import "./Hero.css";

const slides = [
  {
    title: "Report Civic Issues.",
    subtitle: "Connect with your local government to report and track civic issues. Together, we can make our communities safer and more livable.",
    image: "https://img.freepik.com/free-photo/observation-urban-building-business-steel_1127-2397.jpg?semt=ais_hybrid&w=740&q=80",
    stats: [
      { icon: <TrendingUp />, number: "1,247", label: "Issues Reported", color: "bg-blue" },
      { icon: <Users />, number: "892", label: "Issues Resolved", color: "bg-green" },
      { icon: <MapPin />, number: "3,456", label: "Active Citizens", color: "bg-purple" },
    ],
  },
  {
    title: "Track Progress Easily.",
    subtitle: "See how your reports are making a real difference in your community.",
    image: "https://t3.ftcdn.net/jpg/06/07/79/64/360_F_607796447_IVlCRMAIF2Y9wwxOY0TKX9YiD2eFxICW.jpg",
    stats: [
      { icon: <TrendingUp />, number: "2,134", label: "Reports Made", color: "bg-blue" },
      { icon: <Users />, number: "1,005", label: "Resolved Issues", color: "bg-green" },
      { icon: <MapPin />, number: "4,012", label: "Active Citizens", color: "bg-purple" },
    ],
  },
  {
    title: "Join the Movement.",
    subtitle: "Be a part of building better, safer, and cleaner communities.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ699-wc2ez6bLKd4BghQyOB2fJTAwMRbqYA&s",
    stats: [
      { icon: <TrendingUp />, number: "3,001", label: "Issues Reported", color: "bg-blue" },
      { icon: <Users />, number: "2,200", label: "Resolved Issues", color: "bg-green" },
      { icon: <MapPin />, number: "5,500", label: "Active Citizens", color: "bg-purple" },
    ],
  },
  {
    title: "Collaborate with Citizens.",
    subtitle: "Engage with local volunteers and civic organizations for maximum impact.",
    image: "https://erns72xipwt.exactdn.com/wp-content/uploads-new/2024/09/uglyindians.jpeg?strip=all&lossy=1&ssl=1",
    stats: [
      { icon: <TrendingUp />, number: "1,500", label: "Reports Made", color: "bg-blue" },
      { icon: <Users />, number: "1,200", label: "Resolved Issues", color: "bg-green" },
      { icon: <MapPin />, number: "3,800", label: "Active Citizens", color: "bg-purple" },
    ],
  },
  {
    title: "Make Communities Safer.",
    subtitle: "Together we can improve safety, infrastructure, and livability.",
    image: "https://www.hindustantimes.com/ht-img/img/2023/07/23/550x309/The-redeveloped-road-stretch-between-Dhaula-Kuan-a_1690135807609.jpg",
    stats: [
      { icon: <TrendingUp />, number: "2,800", label: "Issues Reported", color: "bg-blue" },
      { icon: <Users />, number: "2,000", label: "Resolved Issues", color: "bg-green" },
      { icon: <MapPin />, number: "6,000", label: "Active Citizens", color: "bg-purple" },
    ],
  },
];

export const Hero = () => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);
  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);

  return (
    <section className="hero-section">
      {slides.map((slide, index) => (
        <div className={`slide ${index === current ? "active" : ""}`} key={index}>
          <div className="hero-bg">
            <Image src={slide.image} alt="Hero" fill priority className="hero-bg-img" />
          </div>

          <div className="hero-content container">
            <h1 className="hero-title">
              {slide.title} <br />
              <span className="hero-glow">Build Better Communities.</span>
            </h1>

            <p className="hero-subtitle">{slide.subtitle}</p>

          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button className="carousel-btn prev" onClick={prevSlide}>&#10094;</button>
      <button className="carousel-btn next" onClick={nextSlide}>&#10095;</button>
    </section>
  );
};
